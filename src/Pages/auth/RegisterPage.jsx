import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContentSettings } from '../../context/ContentSettingsContext';
import ImageWithFallback from '../../components/shared/ImageWithFallback';
import { getBrandDisplayName } from '../../config/brand';

const RegisterPage = () => {
    const { settings } = useContentSettings();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

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
            const parts = String(formData.name || '').trim().split(/\s+/).filter(Boolean);
            const firstName = parts[0] || '';
            const lastName = parts.length > 1 ? parts.slice(1).join(' ') : 'User';

            const result = await register({
                firstName,
                lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });

            if (result.success) {
                navigate('/profile');
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Registration error:', err);
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
                            Create account
                        </h2>
                        <p className="mt-2 text-sm text-glowalchemy-warm-gray">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-glowalchemy-terracotta hover:text-glowalchemy-charcoal transition-colors">
                                Sign in
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
                            <label htmlFor="name" className="text-sm font-semibold text-glowalchemy-charcoal">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="w-full rounded-xl border border-glowalchemy-sand bg-white px-4 py-3 text-sm text-glowalchemy-charcoal placeholder-glowalchemy-warm-gray focus:outline-none focus:ring-2 focus:ring-glowalchemy-sand focus:border-glowalchemy-terracotta"
                                placeholder="Full name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-sm font-semibold text-glowalchemy-charcoal">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full rounded-xl border border-glowalchemy-sand bg-white px-4 py-3 text-sm text-glowalchemy-charcoal placeholder-glowalchemy-warm-gray focus:outline-none focus:ring-2 focus:ring-glowalchemy-sand focus:border-glowalchemy-terracotta"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="phone" className="text-sm font-semibold text-glowalchemy-charcoal">
                                Mobile number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                inputMode="numeric"
                                required
                                className="w-full rounded-xl border border-glowalchemy-sand bg-white px-4 py-3 text-sm text-glowalchemy-charcoal placeholder-glowalchemy-warm-gray focus:outline-none focus:ring-2 focus:ring-glowalchemy-sand focus:border-glowalchemy-terracotta"
                                placeholder="Enter mobile number"
                                value={formData.phone}
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
                                autoComplete="new-password"
                                required
                                className="w-full rounded-xl border border-glowalchemy-sand bg-white px-4 py-3 text-sm text-glowalchemy-charcoal placeholder-glowalchemy-warm-gray focus:outline-none focus:ring-2 focus:ring-glowalchemy-sand focus:border-glowalchemy-terracotta"
                                placeholder="Create password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <label className="flex items-start gap-2 text-sm text-glowalchemy-charcoal pt-1">
                            <input
                                id="agree-terms"
                                name="agree-terms"
                                type="checkbox"
                                required
                                className="mt-1 h-4 w-4 rounded border-glowalchemy-sand text-glowalchemy-terracotta focus:ring-glowalchemy-terracotta"
                            />
                            <span>
                                I agree to the{' '}
                                <Link to="/terms-of-service" className="font-semibold text-glowalchemy-terracotta hover:text-glowalchemy-charcoal">
                                    Terms and Conditions
                                </Link>
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 text-sm font-semibold disabled:opacity-50 bg-glowalchemy-terracotta text-white hover:bg-glowalchemy-charcoal"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
