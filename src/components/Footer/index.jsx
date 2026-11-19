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
        <footer className={`${hideOnMobile ? 'hidden md:block' : ''} bg-brand-primary text-glowalchemy-warm-gray mt-auto`}>
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {/* GlowAlchemy */}
                    <div>
                        <h3 className="text-xl font-semibold tracking-tight text-glowalchemy-white mb-3">{getBrandDisplayName()}</h3>
                        <p className="mt-2 text-sm leading-5 text-glowalchemy-sand">
                            Discover the art of beauty with GlowAlchemy. We bring you high-quality cosmetic products crafted to enhance your beauty, inspire confidence, and elevate your skincare experience.
                        </p>
                        
                        {/* Social Icons */}
                        <div className="mt-4 flex items-center gap-2">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-glowalchemy-sand bg-glowalchemy-ivory text-glowalchemy-charcoal transition hover:bg-glowalchemy-sand hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/70"
                            >
                                <FaFacebook className="h-4 w-4" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-glowalchemy-sand bg-glowalchemy-ivory text-glowalchemy-charcoal transition hover:bg-glowalchemy-sand hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/70"
                            >
                                <FaTwitter className="h-4 w-4" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-glowalchemy-sand bg-glowalchemy-ivory text-glowalchemy-charcoal transition hover:bg-glowalchemy-sand hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/70"
                            >
                                <FaInstagram className="h-4 w-4" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-glowalchemy-sand bg-glowalchemy-ivory text-glowalchemy-charcoal transition hover:bg-glowalchemy-sand hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/70"
                            >
                                <FaLinkedin className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-glowalchemy-white/90 mb-3">Quick Links</h4>
                        <ul className="mt-3 space-y-2 text-sm">
                            <li><Link to="/" className="text-glowalchemy-sand transition hover:text-glowalchemy-white focus:outline-none focus:underline">Home</Link></li>
                            <li><Link to="/ProductListing" className="text-glowalchemy-sand transition hover:text-glowalchemy-white focus:outline-none focus:underline">Products</Link></li>
                            <li><Link to="/cart" className="text-glowalchemy-sand transition hover:text-glowalchemy-white focus:outline-none focus-underline">Cart</Link></li>
                        </ul>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-glowalchemy-white/90 mb-3">Products</h4>
                        <ul className="mt-3 space-y-2 text-sm">
                            <li><Link to="/ProductListing?category=Haircare" className="text-glowalchemy-sand transition hover:text-glowalchemy-white focus:outline-none focus-underline">Hair Care</Link></li>
                            <li><Link to="/ProductListing?category=Body%20Care" className="text-glowalchemy-sand transition hover:text-glowalchemy-white focus:outline-none focus:underline">Body Care</Link></li>
                            <li><Link to="/ProductListing?category=Face%20Care" className="text-glowalchemy-sand transition hover:text-glowalchemy-white focus:outline-none focus-underline">Face Care</Link></li>
                            <li><Link to="/ProductListing?category=Lip%20Care" className="text-glowalchemy-sand transition hover:text-glowalchemy-white focus:outline-none focus-underline">Lip Care</Link></li>
                            <li><Link to="/ProductListing?category=Skincare" className="text-glowalchemy-sand transition hover:text-glowalchemy-white focus:outline-none focus-underline">Skin Care</Link></li>
                        </ul>
                    </div>

                    {/* Explore */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-glowalchemy-white/90 mb-3">Explore</h4>
                        <ul className="mt-3 space-y-2 text-sm">
                            <li><Link to="/about" className="text-glowalchemy-sand transition hover:text-glowalchemy-white focus:outline-none focus-underline">About Us</Link></li>
                            <li><Link to="/company-profile" className="text-glowalchemy-sand transition hover:text-glowalchemy-white focus:outline-none focus-underline">Company Profile</Link></li>
                            <li><Link to="/manufacturing-capabilities" className="text-glowalchemy-sand transition hover:text-glowalchemy-white focus:outline-none focus-underline">Manufacturing Capabilities</Link></li>
                            <li><Link to="/blog" className="text-glowalchemy-sand transition hover:text-glowalchemy-white focus:outline-none focus:underline">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-glowalchemy-white/90 mb-3">Customer Service</h4>
                        <ul className="mt-3 space-y-2 text-sm">
                            <li><Link to="/contact" className="text-glowalchemy-sand transition hover:text-glowalchemy-white focus:outline-none focus:underline">Contact Us</Link></li>
                            <li><Link to="/privacy-policy" className="text-glowalchemy-sand transition hover:text-glowalchemy-white focus:outline-none focus:underline">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-service" className="text-glowalchemy-sand transition hover:text-glowalchemy-white focus:outline-none focus:underline">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* Contact Details */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-glowalchemy-white/90 mb-3">Contact Details</h4>
                        <div className="mt-3 space-y-2 text-sm">
                            <div>
                                <p className="text-xs text-glowalchemy-white font-semibold">Phone</p>
                                <p className="text-glowalchemy-sand">+91 73592 30538</p>
                            </div>
                            <div>
                                <p className="text-xs text-glowalchemy-white font-semibold">Email</p>
                                <p className="text-glowalchemy-sand">glowalchemy67@gmail.com</p>
                            </div>
                            <div>
                                <p className="text-xs text-glowalchemy-white font-semibold">Address</p>
                                <p className="text-glowalchemy-sand">Sarthana, Varachha</p>
                                <p className="text-glowalchemy-sand">Surat, Gujarat</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 border-t border-glowalchemy-sand pt-6">
                    <p className="text-center text-xs text-glowalchemy-warm-gray">
                        2026 {getBrandDisplayName()}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
