import React, { useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContentSettings } from '../../context/ContentSettingsContext';
import ImageWithFallback from '../../components/shared/ImageWithFallback';
import { getBrandDisplayName } from '../../config/brand';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_RE = /^\+?[\d\s-]{10,15}$/;

const LoginPage = () => {
    const { settings } = useContentSettings();
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const identifierRef = useRef(null);
    const passwordRef = useRef(null);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear the field's own error as soon as the user edits it.
        setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
        if (error) setError('');
    };

    /** Field-level validation — shown inline, never only as a toast. */
    const validate = () => {
        const next = {};
        const identifier = formData.identifier.trim();

        if (!identifier) {
            next.identifier = 'Enter your email address or mobile number.';
        } else if (!EMAIL_RE.test(identifier) && !PHONE_RE.test(identifier.replace(/[\s-]/g, ''))) {
            next.identifier = 'Enter a valid email address or mobile number.';
        }

        if (!formData.password) {
            next.password = 'Enter your password.';
        }

        return next;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationErrors = validate();
        if (Object.keys(validationErrors).some((key) => validationErrors[key])) {
            setFieldErrors(validationErrors);
            // Move focus to the first invalid field (a11y + keyboard flow).
            if (validationErrors.identifier) identifierRef.current?.focus();
            else if (validationErrors.password) passwordRef.current?.focus();
            return;
        }

        setFieldErrors({});
        setLoading(true);

        try {
            const result = await login({ identifier: formData.identifier.trim(), password: formData.password });

            if (result.success) {
                const redirectTo = searchParams.get('redirect') || '/';
                navigate(redirectTo);
            } else {
                setError(result.error || "We couldn't sign you in with those details. Please try again.");
            }
        } catch (err) {
            setError(err?.normalized?.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fieldClass = (name) =>
        `w-full rounded-xl border bg-white px-4 py-3 text-sm text-glowalchemy-charcoal placeholder-glowalchemy-warm-gray focus:outline-none focus:ring-2 ${
            fieldErrors[name]
                ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                : 'border-glowalchemy-sand focus:ring-glowalchemy-sand focus:border-glowalchemy-terracotta'
        }`;

    return (
        <div className="min-h-screen bg-glowalchemy-ivory px-4 py-10 flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="rounded-2xl bg-glowalchemy-white border border-glowalchemy-sand shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-6 sm:p-8">
                    <div className="text-center">
                        {settings?.brandLogoUrl ? (
                            <div className="inline-flex items-center justify-center h-32 w-32 rounded-2xl bg-glowalchemy-ivory mb-4">
                                <ImageWithFallback
                                    src={settings.brandLogoUrl}
                                    alt={getBrandDisplayName()}
                                    className="h-28 w-28 object-contain"
                                    fallbackType="logo"
                                />
                            </div>
                        ) : (
                            <h1 className="text-4xl font-bold text-brand-primary mb-4">{getBrandDisplayName()}</h1>
                        )}
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-glowalchemy-charcoal tracking-tight">
                            Sign in
                        </h2>
                        <p className="mt-2 text-sm text-glowalchemy-warm-gray">
                            New here?{' '}
                            <Link to="/register" className="font-semibold text-glowalchemy-terracotta hover:text-glowalchemy-charcoal transition-colors">
                                Create account
                            </Link>
                        </p>
                    </div>

                    {/* noValidate: our own accessible messages replace the browser bubbles. */}
                    <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
                        {error && (
                            <div
                                role="alert"
                                className="bg-glowalchemy-ivory border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                            >
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label htmlFor="identifier" className="text-sm font-semibold text-glowalchemy-charcoal">
                                Email or mobile
                            </label>
                            <input
                                ref={identifierRef}
                                id="identifier"
                                name="identifier"
                                type="text"
                                autoComplete="username"
                                aria-invalid={fieldErrors.identifier ? 'true' : 'false'}
                                aria-describedby={fieldErrors.identifier ? 'identifier-error' : undefined}
                                className={fieldClass('identifier')}
                                placeholder="you@example.com or 9876543210"
                                value={formData.identifier}
                                onChange={handleChange}
                            />
                            {fieldErrors.identifier && (
                                <p id="identifier-error" role="alert" className="text-sm text-red-600">
                                    {fieldErrors.identifier}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-sm font-semibold text-glowalchemy-charcoal">
                                Password
                            </label>
                            <input
                                ref={passwordRef}
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                aria-invalid={fieldErrors.password ? 'true' : 'false'}
                                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                                className={fieldClass('password')}
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {fieldErrors.password && (
                                <p id="password-error" role="alert" className="text-sm text-red-600">
                                    {fieldErrors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="inline-flex items-center gap-2 text-sm text-glowalchemy-charcoal">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-brand-line text-glowalchemy-terracotta focus:ring-orange-500"
                                />
                                Remember me
                            </label>

                            <Link to="/forgot-password" className="text-sm font-semibold text-glowalchemy-terracotta hover:text-orange-700">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 text-sm font-semibold disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
