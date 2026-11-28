import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { isChunkLoadError } from '../../utils/chunkRecovery';

/**
 * ErrorBoundary — keeps a render-time exception from blanking the whole app.
 *
 * Without one, a single failing page component unmounts the entire React tree
 * (white screen, header and footer gone). This boundary renders a themed
 * recovery UI instead, logs the error (message + component stack only — never
 * user data or tokens), and clears itself when the route changes.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, resetKey: props.resetKey };
  }

  // A new route always starts with a clean slate.
  static getDerivedStateFromProps(props, state) {
    if (props.resetKey !== state.resetKey) {
      return { error: null, resetKey: props.resetKey };
    }
    return null;
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Deliberately narrow: error message + component stack. No tokens, no
    // request bodies, no personal data. Wire a Sentry capture here once a DSN
    // is configured.
    console.error('[ErrorBoundary]', error?.message, info?.componentStack);
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    // Stale-deployment chunk failures get a dedicated message: the automatic
    // reload was suppressed (protected route or reload guard), so offer a
    // user-controlled refresh instead of a pointless "try again".
    if (isChunkLoadError(error)) {
      return (
        <section className="min-h-[60vh] flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md rounded-2xl border border-brand-line bg-brand-surface p-6 sm:p-8 text-center shadow-sm">
            <h1 className="ga-serif text-2xl text-brand-ink">A new version is available</h1>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted">
              GlowAlchemy Care was just updated and this page needs a refresh to load the latest
              version. Your cart and account are unaffected.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleRefresh}
                className="rounded-lg bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2"
              >
                Refresh Page
              </button>
              <Link
                to="/"
                className="rounded-lg border border-brand-primary px-5 py-3 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2"
              >
                Back to home
              </Link>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-brand-line bg-brand-surface p-6 sm:p-8 text-center shadow-sm">
          <h1 className="ga-serif text-2xl text-brand-ink">Something went wrong</h1>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted">
            This section failed to load. Your cart and account are unaffected.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleRetry}
              className="rounded-lg bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2"
            >
              Try again
            </button>
            <Link
              to="/"
              onClick={this.handleRetry}
              className="rounded-lg border border-brand-primary px-5 py-3 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    );
  }
}

/** Route-scoped boundary: resets automatically on navigation. */
export const RouteErrorBoundary = ({ children }) => {
  const location = useLocation();
  return <ErrorBoundary resetKey={`${location.pathname}${location.search || ''}`}>{children}</ErrorBoundary>;
};

export default ErrorBoundary;
