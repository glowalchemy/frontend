/**
 * Unit tests for the storefront's shared error normalizer.
 *
 *   node --test frontend/scripts/test-error-messages.mjs
 *
 * The module is framework-free, so it runs directly in Node: these tests pin
 * the exact wording a customer sees for every failure class.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MESSAGES,
  isSafeMessage,
  isCanceled,
  normalizeApiError,
  errorMessage,
} from '../src/utils/errors.js';

const axiosError = ({ status, data, headers, code } = {}) => {
  const err = new Error('Request failed');
  err.isAxiosError = true;
  if (code) err.code = code;
  if (status !== undefined) err.response = { status, data, headers };
  return err;
};

test('deliberate cancellation is not a user-facing failure', () => {
  const aborted = Object.assign(new Error('canceled'), { name: 'AbortError' });
  assert.equal(isCanceled(aborted), true);
  assert.equal(isCanceled({ name: 'CanceledError' }), true);
  assert.equal(isCanceled({ code: 'ERR_CANCELED' }), true);
  assert.equal(isCanceled(new Error('boom')), false);

  const out = normalizeApiError(aborted);
  assert.equal(out.canceled, true);
  assert.equal(out.kind, 'canceled');
  assert.equal(out.message, '');
  assert.equal(out.retryable, false);
});

test('network failure is distinguished from a timeout', () => {
  const network = normalizeApiError(new TypeError('Failed to fetch'));
  assert.equal(network.kind, 'network');
  assert.equal(network.message, MESSAGES.network);
  assert.equal(network.retryable, true);

  const timeout = normalizeApiError(axiosError({ code: 'ECONNABORTED' }));
  assert.equal(timeout.kind, 'timeout');
  assert.equal(timeout.message, MESSAGES.timeout);
  assert.equal(timeout.retryable, true);
});

test('offline is reported before generic network failure', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  Object.defineProperty(globalThis, 'navigator', { value: { onLine: false }, configurable: true });
  try {
    const out = normalizeApiError(new TypeError('Failed to fetch'));
    assert.equal(out.kind, 'offline');
    assert.equal(out.message, MESSAGES.offline);
  } finally {
    if (original) Object.defineProperty(globalThis, 'navigator', original);
    else delete globalThis.navigator;
  }
});

test('a safe backend message is preserved (login failure wording)', () => {
  const out = normalizeApiError(
    axiosError({ status: 401, data: { success: false, message: 'Invalid email or password.' } })
  );
  assert.equal(out.kind, 'auth');
  assert.equal(out.message, 'Invalid email or password.');
});

test('401 without a usable message falls back to the session message', () => {
  const out = normalizeApiError(axiosError({ status: 401, data: {} }));
  assert.equal(out.message, MESSAGES.auth);
  assert.equal(out.retryable, false);
});

test('403 / 404 / 409 map to their own wording', () => {
  assert.equal(normalizeApiError(axiosError({ status: 403, data: {} })).message, MESSAGES.forbidden);
  assert.equal(normalizeApiError(axiosError({ status: 404, data: {} })).message, MESSAGES.notFound);
  assert.equal(normalizeApiError(axiosError({ status: 409, data: {} })).message, MESSAGES.conflict);
});

test('422 validation details survive and keep the safe server sentence', () => {
  const out = normalizeApiError(
    axiosError({
      status: 422,
      data: {
        success: false,
        message: 'Please check the highlighted fields.',
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Please check the highlighted fields.',
          details: [{ field: 'email', message: 'This value is not valid.' }],
          requestId: 'req-1234',
        },
      },
    })
  );
  assert.equal(out.kind, 'validation');
  assert.equal(out.code, 'VALIDATION_FAILED');
  assert.equal(out.message, 'Please check the highlighted fields.');
  assert.deepEqual(out.details, [{ field: 'email', message: 'This value is not valid.' }]);
  assert.equal(out.requestId, 'req-1234');
});

test('429 exposes Retry-After in milliseconds', () => {
  const out = normalizeApiError(
    axiosError({
      status: 429,
      data: { error: { code: 'RATE_LIMITED', message: 'Too many requests. Please wait a moment and try again.' } },
      headers: { 'retry-after': '5' },
    })
  );
  assert.equal(out.kind, 'rateLimit');
  assert.equal(out.retryAfterMs, 5000);
  assert.equal(out.retryable, true);
});

test('413 upload failures show the specific server limit, not a generic error', () => {
  const out = normalizeApiError(
    axiosError({
      status: 413,
      data: {
        success: false,
        error: { code: 'FILE_TOO_LARGE', message: 'File size 9.0MB exceeds the 8MB upload limit', requestId: 'r1' },
      },
    })
  );
  assert.equal(out.kind, 'upload');
  assert.equal(out.code, 'FILE_TOO_LARGE');
  assert.match(out.message, /9\.0MB exceeds the 8MB/);
});

test('5xx never leaks internals', () => {
  const technical = axiosError({
    status: 500,
    data: {
      success: false,
      message: "Cast to ObjectId failed for value 'abc' at path _id",
    },
  });
  const out = normalizeApiError(technical);
  assert.equal(out.kind, 'server');
  assert.equal(out.message, MESSAGES.server);
  assert.doesNotMatch(out.message, /ObjectId|_id/);
  assert.equal(out.retryable, true);
});

test('HTML or stack-trace payloads are rejected as user text', () => {
  const html = normalizeApiError(axiosError({ status: 500, data: { message: '<!DOCTYPE html><html>...' } }));
  assert.equal(html.message, MESSAGES.server);

  const stack = normalizeApiError(
    axiosError({ status: 400, data: { message: 'TypeError: x is not a function\n    at foo (/app/x.js:10:2)' } })
  );
  assert.equal(stack.message, MESSAGES.validation);

  assert.equal(isSafeMessage('Enter a valid email address.'), true);
  assert.equal(isSafeMessage('x'), false);
  assert.equal(isSafeMessage('E11000 duplicate key error'), false);
  assert.equal(isSafeMessage(''), false);
});

test('errorMessage() is the single string helper pages use', () => {
  assert.equal(errorMessage(axiosError({ status: 403 })), MESSAGES.forbidden);
  assert.equal(errorMessage(new Error('anything'), { fallback: 'Custom fallback.' }), 'Custom fallback.');
});
