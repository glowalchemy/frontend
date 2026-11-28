/**
 * Stale-deployment chunk recovery.
 *
 * After a new frontend deploy, browsers holding the old index.html request
 * hashed chunks (e.g. Home-5wqqcdi_.js) that no longer exist -> 404 -> the
 * dynamic import() rejects. Vite surfaces this as a cancelable
 * `vite:preloadError` window event before the error reaches React.
 *
 * Strategy:
 *  - On a chunk/preload failure, reload the page ONCE so the browser picks
 *    up the new index.html and its fresh asset map.
 *  - A sessionStorage timestamp guards the reload: at most one automatic
 *    reload per cooldown window, so a genuinely missing asset can never
 *    cause an infinite reload loop. When the guard blocks a reload, the
 *    original error propagates to the ErrorBoundary, which shows a
 *    user-controlled "Refresh Page" option.
 *  - Checkout, payment and other stateful routes are never auto-reloaded —
 *    losing in-progress form/order state is worse than a manual refresh.
 */

const RELOAD_GUARD_KEY = 'glowalchemy:chunk-reload-at';
const RELOAD_COOLDOWN_MS = 60 * 1000;

// Routes where an automatic reload could destroy unsaved user state.
const PROTECTED_PATH_PATTERN = /^\/(checkout|payment|summary|cart|profile|orders|order-tracking|admin)(\/|$)/;

const isProtectedRoute = () =>
  typeof window !== 'undefined' && PROTECTED_PATH_PATTERN.test(window.location.pathname);

const readLastReloadAt = () => {
  try {
    return Number(window.sessionStorage.getItem(RELOAD_GUARD_KEY) || 0);
  } catch (_e) {
    return 0;
  }
};

const markReloadAttempt = () => {
  try {
    window.sessionStorage.setItem(RELOAD_GUARD_KEY, String(Date.now()));
  } catch (_e) {
    /* storage unavailable — module-level flag below still guards this session */
  }
};

// Fallback guard for environments where sessionStorage throws.
let reloadAttemptedThisSession = false;

/**
 * Decide whether an automatic reload is allowed right now.
 * Marks the attempt when it returns true.
 */
const claimReload = () => {
  if (reloadAttemptedThisSession) return false;
  if (Date.now() - readLastReloadAt() < RELOAD_COOLDOWN_MS) return false;
  reloadAttemptedThisSession = true;
  markReloadAttempt();
  return true;
};

export const isChunkLoadError = (error) => {
  const message = String(error?.message || error || '');
  return /dynamically imported module|loading chunk|chunkloaderror|importing a module script failed|unable to preload|failed to fetch.*\.js|error loading.*module/i.test(
    message,
  );
};

const handlePreloadError = (event) => {
  // Only recover from asset/chunk loading failures — never from app errors.
  if (!isChunkLoadError(event?.payload)) return;

  if (isProtectedRoute() || !claimReload()) {
    // Let the original error propagate to the ErrorBoundary, which renders
    // the friendly refresh UI. Do NOT preventDefault here.
    return;
  }

  // Prevent Vite from rethrowing; the page is about to reload anyway.
  event.preventDefault();
  window.location.reload();
};

let registered = false;

/**
 * Register the vite:preloadError recovery listener. Idempotent and safe to
 * call once at app bootstrap (before React renders) so lazy route chunks
 * are covered from the very first navigation.
 */
export const initChunkRecovery = () => {
  if (registered || typeof window === 'undefined') return;
  registered = true;
  window.addEventListener('vite:preloadError', handlePreloadError);
};

export default initChunkRecovery;
