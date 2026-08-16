import axios from "axios";

const inferLocalApiBaseUrl = () => {
    if (typeof window === "undefined") return "/api";
    return "/api";
};

const apiBaseUrl = import.meta.env.VITE_API_URL || inferLocalApiBaseUrl();

/**
 * Resolve the API origin (scheme + host + port, no trailing slash) from the
 * configured base URL. Used to build absolute URLs for server-hosted assets
 * (e.g. product/category images). Falls back to the current page origin.
 */
export function getApiOrigin() {
    const base = String(apiBaseUrl || "").trim();
    if (/^https?:\/\//i.test(base)) {
        return base.replace(/\/?api\/?$/, "").replace(/\/+$/, "");
    }
    if (typeof window !== "undefined") {
        return window.location.origin;
    }
    return "";
}

/**
 * Resolve a possibly-relative asset URL (e.g. "/uploads/x.png") to an absolute
 * URL using the API origin. Absolute URLs pass through unchanged.
 */
export function toAbsoluteUrl(value) {
    const raw = typeof value === "string" ? value : "";
    const s = raw.trim();
    if (!s) return "";
    if (/^https?:\/\//i.test(s)) return s;
    if (s.startsWith("//")) return `https:${s}`;
    if (s.startsWith("/")) return `${getApiOrigin()}${s}`;
    return s;
}

let hasLoggedNetworkError = false;

const inferAlternateBaseUrl = (current) => {
    if (typeof window === "undefined") return null;
    const s = String(current || "");
    if (!s.includes("localhost") && !s.includes("127.0.0.1")) return null;
    // No alternate port fallback needed with consistent port 5000
    return null;
};

export const api = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

// In-flight GET dedupe: identical concurrent GET requests share a single
// promise, so React StrictMode double-mounts or multiple components loading
// the same data do not duplicate network calls. Results are NOT cached after
// completion — later calls always refetch (fresh data).
const inFlight = new Map();

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // NOTE: catalog GETs intentionally do NOT cache-bust. The backend sets
        // a short public Cache-Control on safe catalog responses (listings,
        // categories, search/suggest) so repeated visits benefit from HTTP
        // caching. Cache prevention remains for authenticated/user-specific
        // endpoints via their own headers.
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        const key = response?.config?.__dedupeKey;
        if (key) {
            inFlight.delete(key);
        }
        return response;
    },
    async (error) => {
        const key = error?.config?.__dedupeKey;
        if (key) {
            inFlight.delete(key);
        }
        const config = error?.config;
        const hasResponse = Boolean(error?.response);

        if (!hasResponse && !hasLoggedNetworkError) {
            hasLoggedNetworkError = true;
            // eslint-disable-next-line no-console
            console.error('[api] Network error: API server unreachable. Check backend is running and proxy/REACT_APP_API_URL config.', {
                baseURL: api.defaults.baseURL,
            });
        }

        // Port fallback removed - using consistent port 5000
        if (!hasResponse && config && !config.__triedAlternateBaseUrl) {
            const alt = inferAlternateBaseUrl(api.defaults.baseURL);
            if (alt) {
                config.__triedAlternateBaseUrl = true;
                config.baseURL = alt;
                return api.request(config);
            }
        }

        if (error.response?.status === 401) {
            // Token expired or invalid, remove it and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Dedupe identical in-flight GETs by overriding api.get. This avoids recursive
// interceptor re-entry while still collapsing StrictMode double-mounts and
// concurrent component fetches of the same URL+params into one network call.
const originalGet = api.get.bind(api);
api.get = (url, config = {}) => {
    const params = config.params ? JSON.stringify(Object.entries(config.params).sort()) : '[]';
    const token = (localStorage.getItem('adminToken') || localStorage.getItem('token') || '').slice(0, 24);
    const key = `GET ${String(url)} ${params} ${token}`;
    const existing = inFlight.get(key);
    if (existing) return existing;
    const promise = originalGet(url, config).finally(() => {
        inFlight.delete(key);
    });
    inFlight.set(key, promise);
    return promise;
};

// Export as apiClient for compatibility
export const apiClient = api;
