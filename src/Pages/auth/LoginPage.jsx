import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContentSettings } from '../../context/ContentSettingsContext';
import ImageWithFallback from '../../components/shared/ImageWithFallback';
import { getBrandDisplayName } from '../../config/brand';

const LoginPage = () => {
    const { settings } = useContentSettings();
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await login({ identifier: formData.identifier, password: formData.password });

            if (result.success) {
                const redirectTo = searchParams.get('redirect') || '/';
                navigate(redirectTo);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

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

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-glowalchemy-ivory border border-glowalchemy-sand text-glowalchemy-terracotta px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label htmlFor="identifier" className="text-sm font-semibold text-glowalchemy-charcoal">
                                Email or mobile
                            </label>
                            <input
                                id="identifier"
                                name="identifier"
                                type="text"
                                required
                                className="w-full rounded-xl border border-glowalchemy-sand bg-white px-4 py-3 text-sm text-glowalchemy-charcoal placeholder-glowalchemy-warm-gray focus:outline-none focus:ring-2 focus:ring-glowalchemy-sand focus:border-glowalchemy-terracotta"
                                placeholder="you@example.com or 9876543210"
                                value={formData.identifier}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-sm font-semibold text-glowalchemy-charcoal">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full rounded-xl border border-glowalchemy-sand bg-white px-4 py-3 text-sm text-glowalchemy-charcoal placeholder-glowalchemy-warm-gray focus:outline-none focus:ring-2 focus:ring-glowalchemy-sand focus:border-glowalchemy-terracotta"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                            />
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
