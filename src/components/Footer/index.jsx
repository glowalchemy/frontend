import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { getBrandDisplayName } from '../../config/brand';

const Footer = () => {
    const location = useLocation();
    const pathname = String(location?.pathname || '');
    const hideOnMobile = (
        pathname.startsWith('/product/') ||
        pathname === '/cart' ||
        pathname === '/checkout' ||
        pathname === '/payment' ||
        pathname === '/summary' ||
        pathname === '/login' ||
        pathname === '/register' ||
        pathname === '/forgot-password' ||
        pathname === '/reset-password' ||
        pathname.startsWith('/ProductListing')
    );
    return (
        <footer className={`${hideOnMobile ? 'hidden md:block' : ''} bg-brand-primary text-trozzi-warm-gray mt-auto`}>
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-14">
                <div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-3">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-semibold tracking-tight text-trozzi-white">{getBrandDisplayName()}</h3>
                        <p className="mt-3 text-sm leading-6 text-trozzi-sand max-w-md">
                            Your one-stop shop for amazing products. Quality, style, and affordability all in one place.
                        </p>
                        <div className="mt-5 flex items-center gap-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-trozzi-sand bg-trozzi-ivory text-trozzi-charcoal transition hover:bg-trozzi-sand hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/70"
                            >
                                <FaFacebook className="h-5 w-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-trozzi-sand bg-trozzi-ivory text-trozzi-charcoal transition hover:bg-trozzi-sand hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/70"
                            >
                                <FaTwitter className="h-5 w-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-trozzi-sand bg-trozzi-ivory text-trozzi-charcoal transition hover:bg-trozzi-sand hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/70"
                            >
                                <FaInstagram className="h-5 w-5" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-trozzi-sand bg-trozzi-ivory text-trozzi-charcoal transition hover:bg-trozzi-sand hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/70"
                            >
                                <FaLinkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-trozzi-white/90">Quick Links</h4>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li><Link to="/" className="text-trozzi-sand transition hover:text-trozzi-white focus:outline-none focus:underline">Home</Link></li>
                            <li><Link to="/ProductListing" className="text-trozzi-sand transition hover:text-trozzi-white focus:outline-none focus:underline">Products</Link></li>
                            <li><Link to="/cart" className="text-trozzi-sand transition hover:text-trozzi-white focus:outline-none focus:underline">Cart</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-trozzi-white/90">Customer Service</h4>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li><Link to="/contact" className="text-trozzi-sand transition hover:text-trozzi-white focus:outline-none focus:underline">Contact Us</Link></li>
                            <li><Link to="/about" className="text-trozzi-sand transition hover:text-trozzi-white focus:outline-none focus:underline">About Us</Link></li>
                            <li><Link to="/shipping-policy" className="text-trozzi-sand transition hover:text-trozzi-white focus:outline-none focus:underline">Shipping Policy</Link></li>
                            <li><Link to="/privacy-policy" className="text-trozzi-sand transition hover:text-trozzi-white focus:outline-none focus:underline">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-service" className="text-trozzi-sand transition hover:text-trozzi-white focus:outline-none focus:underline">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 border-t border-trozzi-sand pt-6">
                    <p className="text-center text-xs text-trozzi-warm-gray">
                        {new Date().getFullYear()} {getBrandDisplayName()}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
