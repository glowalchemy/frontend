/**
 * Shared error normalisation for the whole storefront.
 *
 * Every API call funnels its failure through `normalizeApiError`, so no page
 * has to know about status codes, axios shapes or offline detection, and one
 * place decides the wording a customer sees.
 *
 * Guarantees:
 *  - Intentional cancellation is not a failure (`canceled: true`, empty text).
 *  - Offline, timeout, network, auth, permission, missing, conflict, rate limit,
 *    validation and server failures are distinguished.
 *  - A backend message is shown only when it is safe (short, no engine/driver
 *    wording, no stack frames, no HTML) — otherwise a friendly fallback.
 */

export const MESSAGES = {
  offline: 'You appear to be offline. Check your connection and try again.',
  timeout: 'That took too long to respond. Please check your connection and try again.',
  network: "We couldn't reach our servers. Please check your connection and try again.",
  server: "We're having trouble processing your request. Please try again shortly.",
  auth: 'Your session has expired. Please sign in again.',
  forbidden: "You don't have permission to perform this action.",
  notFound: 'This item is no longer available.',
  conflict: 'This action was already completed. Please refresh and try again.',
  rateLimit: 'Too many requests. Please wait a moment and try again.',
  validation: 'Please check the details you entered and try again.',
  unknown: 'Something went wrong. Please try again.',
  upload: 'The upload failed. Please try again.',
  cart: "Couldn't update your cart. Please try again.",
  paymentPending: "We couldn't confirm your payment yet. We'll keep checking — please don't pay again.",
};

const TECHNICAL = [
  /\b(Error|Exception|TypeError|ReferenceError|SyntaxError|CastError|ValidationError|MongoServerError|MongooseError)\b/,
  /\bE11000\b/,
  /\bECONNREFUSED\b|\bECONNRESET\b|\bETIMEDOUT\b|\bENOTFOUND\b/,
  /at\s+[\w$.<>]+\s+\(/,
  /\.js:\d+/,
  /node_modules/,
  /\/home\/|\/var\/|[A-Z]:\\/,
  /\bsharp\b|\blibvips\b/i,
  /\bstack\b/,
  /<[a-z!/]/i,
  /undefined is not|Cannot read propert|is not a function/,
  /Cast to ObjectId/,
  /Path `[^`]*`/,
  /duplicate key/i,
];

/** True when a server-provided message is safe to show a customer. */
export function isSafeMessage(text) {
  if (typeof text !== 'string') return false;
  const value = text.trim();
  if (value.length < 2 || value.length > 300) return false;
  if (TECHNICAL.some((re) => re.test(value))) return false;
  return true;
}

function pickServerMessage(payload) {
  if (!payload || typeof payload !== 'object') return '';
  const nested = payload.error;
  if (nested && typeof nested === 'object' && isSafeMessage(nested.message)) return nested.message.trim();
  if (isSafeMessage(payload.message)) return payload.message.trim();
  if (isSafeMessage(payload.error)) return payload.error.trim();
  return '';
}

function retryAfterFrom(headers) {
  if (!headers || typeof headers !== 'object') return undefined;
  const raw = headers['retry-after'] ?? headers['Retry-After'];
  if (raw === undefined || raw === null || raw === '') return undefined;
  const seconds = Number(raw);
  if (Number.isFinite(seconds)) return Math.max(0, Math.round(seconds * 1000));
  const when = Date.parse(String(raw));
  return Number.isNaN(when) ? undefined : Math.max(0, when - Date.now());
}

const DEFAULT_KIND_MESSAGE = {
  offline: MESSAGES.offline,
  timeout: MESSAGES.timeout,
  network: MESSAGES.network,
  auth: MESSAGES.auth,
  forbidden: MESSAGES.forbidden,
  notFound: MESSAGES.notFound,
  conflict: MESSAGES.conflict,
  rateLimit: MESSAGES.rateLimit,
  validation: MESSAGES.validation,
  server: MESSAGES.server,
  upload: MESSAGES.upload,
  unknown: MESSAGES.unknown,
};

function kindForStatus(status) {
  if (status === 401) return 'auth';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'notFound';
  if (status === 409) return 'conflict';
  if (status === 413) return 'upload';
  if (status === 415) return 'upload';
  if (status === 422) return 'validation';
  if (status === 429) return 'rateLimit';
  if (status >= 500) return 'server';
  if (status >= 400) return 'validation';
  return 'unknown';
}

/**
 * @param {unknown} error axios error, fetch wrapper error or plain Error
 * @param {{ fallback?: string }} [options]
 * @returns {{
 *   kind: string, code: string, status: number, message: string,
 *   details?: unknown, requestId?: string, retryable: boolean,
 *   canceled: boolean, retryAfterMs?: number
 * }}
 */
export function normalizeApiError(error, options = {}) {
  const fallback = options.fallback || MESSAGES.unknown;

  // Deliberate cancellation (route change, superseded search, unmount).
  const name = String(error?.name || '');
  const rawCode = String(error?.code || '');
  const canceled =
    name === 'AbortError' ||
    name === 'CanceledError' ||
    rawCode === 'ERR_CANCELED' ||
    error?.canceled === true;
  if (canceled) {
    return { kind: 'canceled', code: 'CANCELED', status: 0, message: '', retryable: false, canceled: true };
  }

  const status = Number(error?.response?.status ?? error?.status ?? error?.statusCode ?? 0) || 0;
  const payload = error?.response?.data ?? error?.data ?? error?.payload ?? undefined;
  const headers = error?.response?.headers ?? error?.headers ?? undefined;

  const code = String(
    (payload && typeof payload === 'object' && payload.error && typeof payload.error === 'object' && payload.error.code) ||
      payload?.code ||
      rawCode ||
      ''
  );

  const requestId =
    (payload && typeof payload === 'object' && payload.error && typeof payload.error === 'object' && payload.error.requestId) ||
    payload?.requestId ||
    headers?.['x-request-id'] ||
    undefined;

  // Offline is checked before network so the copy is actionable.
  const offline =
    (typeof navigator !== 'undefined' && navigator.onLine === false) || rawCode === 'ERR_INTERNET_DISCONNECTED';

  const timeout =
    rawCode === 'ECONNABORTED' ||
    rawCode === 'ETIMEDOUT' ||
    rawCode === 'ERR_NETWORK_TIMEOUT' ||
    /timeout/i.test(String(error?.message || ''));

  let kind;
  if (status > 0) kind = kindForStatus(status);
  else if (offline) kind = 'offline';
  else if (timeout) kind = 'timeout';
  else kind = 'network';

  const retryable =
    kind === 'network' ||
    kind === 'timeout' ||
    kind === 'server' ||
    status === 429 ||
    code === 'UPLOAD_UNAVAILABLE';

  // Prefer a safe, specific backend sentence (validation wording, upload limits,
  // "Invalid email or password"). 5xx never use server wording: an internal
  // failure has no meaning for a customer and is the likeliest place for a
  // driver message or stack fragment to leak.
  let message = kind === 'server' ? '' : pickServerMessage(payload);
  if (!message) message = options.fallback || DEFAULT_KIND_MESSAGE[kind];
  if (!isSafeMessage(message)) message = DEFAULT_KIND_MESSAGE[kind] || MESSAGES.unknown;

  return {
    kind,
    code: code || kind.toUpperCase(),
    status,
    message,
    details: payload && typeof payload === 'object' ? payload.error?.details ?? payload.details : undefined,
    requestId,
    retryable,
    canceled: false,
    retryAfterMs: status === 429 ? retryAfterFrom(headers) : undefined,
  };
}

/** Convenience: the string a page/toast should show. */
export function errorMessage(error, options = {}) {
  return normalizeApiError(error, options).message;
}

/** True for a deliberate cancellation (callers must not surface it). */
export function isCanceled(error) {
  const name = String(error?.name || '');
  return (
    name === 'AbortError' ||
    name === 'CanceledError' ||
    String(error?.code || '') === 'ERR_CANCELED' ||
    error?.canceled === true
  );
}

export default normalizeApiError;
