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

        const result = await login({ identifier: formData.identifier, password: formData.password });

        if (result.success) {
            const redirectTo = searchParams.get('redirect') || '/';
            navigate(redirectTo);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-trozzi-ivory px-4 py-10 flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="rounded-2xl bg-trozzi-white border border-trozzi-sand shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-6 sm:p-8">
                    <div className="text-center">
                        {settings?.brandLogoUrl ? (
                            <div className="inline-flex items-center justify-center h-32 w-32 rounded-2xl bg-trozzi-ivory mb-4">
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
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-trozzi-charcoal tracking-tight">
                            Sign in
                        </h2>
                        <p className="mt-2 text-sm text-trozzi-warm-gray">
                            New here?{' '}
                            <Link to="/register" className="font-semibold text-trozzi-terracotta hover:text-trozzi-charcoal transition-colors">
                                Create account
                            </Link>
                        </p>
                    </div>

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-trozzi-ivory border border-trozzi-sand text-trozzi-terracotta px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label htmlFor="identifier" className="text-sm font-semibold text-trozzi-charcoal">
                                Email or mobile
                            </label>
                            <input
                                id="identifier"
                                name="identifier"
                                type="text"
                                required
                                className="w-full rounded-xl border border-trozzi-sand bg-white px-4 py-3 text-sm text-trozzi-charcoal placeholder-trozzi-warm-gray focus:outline-none focus:ring-2 focus:ring-trozzi-sand focus:border-trozzi-terracotta"
                                placeholder="you@example.com or 9876543210"
                                value={formData.identifier}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-sm font-semibold text-trozzi-charcoal">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full rounded-xl border border-trozzi-sand bg-white px-4 py-3 text-sm text-trozzi-charcoal placeholder-trozzi-warm-gray focus:outline-none focus:ring-2 focus:ring-trozzi-sand focus:border-trozzi-terracotta"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="inline-flex items-center gap-2 text-sm text-trozzi-charcoal">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-trozzi-terracotta focus:ring-orange-500"
                                />
                                Remember me
                            </label>

                            <Link to="/forgot-password" className="text-sm font-semibold text-trozzi-terracotta hover:text-orange-700">
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
