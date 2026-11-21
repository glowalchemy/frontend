import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin, FiShield } from 'react-icons/fi';
import { getBrandDisplayName, getBrandTagline } from '../../config/brand';

const SOCIALS = [
  { href: 'https://facebook.com', label: 'Facebook', Icon: FaFacebookF },
  { href: 'https://instagram.com', label: 'Instagram', Icon: FaInstagram },
  { href: 'https://twitter.com', label: 'Twitter', Icon: FaTwitter },
  { href: 'https://linkedin.com', label: 'LinkedIn', Icon: FaLinkedinIn },
];

const PAYMENT_METHODS = ['Visa', 'Mastercard', 'UPI', 'Net Banking', 'Cash on Delivery'];

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
    <footer className={`${hideOnMobile ? 'hidden md:block' : ''} mt-auto bg-brand-primary-active text-brand-ivory`}>
      <div className="ga-container py-12 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.15fr] lg:gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-ivory p-1.5">
                <img
                  src="/logo.png"
                  alt=""
                  className="h-full w-full object-contain"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </span>
              <span>
                <span className="ga-serif block text-[22px] leading-none text-brand-ivory">
                  {getBrandDisplayName()}
                </span>
                <span className="mt-1 block text-[9px] uppercase tracking-[0.2em] text-brand-champagne/70">
                  {getBrandTagline()}
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-[12.5px] leading-relaxed text-brand-ivory/75">
              Discover the art of beauty with GlowAlchemy. High-quality cosmetics and natural care crafted
              to enhance your beauty, inspire confidence and elevate your everyday ritual.
            </p>

            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-ivory/20 text-brand-ivory/75 transition-colors hover:border-brand-accent hover:bg-brand-accent hover:text-brand-ink"
                >
                  <Icon className="text-[13px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="ga-eyebrow mb-4 text-[10px] text-brand-accent">Quick Links</h3>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link to="/" className="text-brand-ivory/75 transition-colors hover:text-brand-ivory">Home</Link></li>
              <li><Link to="/ProductListing" className="text-brand-ivory/75 transition-colors hover:text-brand-ivory">Products</Link></li>
              <li><Link to="/about" className="text-brand-ivory/75 transition-colors hover:text-brand-ivory">About Us</Link></li>
              <li><Link to="/contact" className="text-brand-ivory/75 transition-colors hover:text-brand-ivory">Contact</Link></li>
              <li><Link to="/blog" className="text-brand-ivory/75 transition-colors hover:text-brand-ivory">Blog</Link></li>
            </ul>
          </div>

          {/* Our Products */}
          <div>
            <h3 className="ga-eyebrow mb-4 text-[10px] text-brand-accent">Our Products</h3>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link to="/ProductListing?category=Body%20Care" className="text-brand-ivory/75 transition-colors hover:text-brand-ivory">Body Care</Link></li>
              <li><Link to="/ProductListing?category=Haircare" className="text-brand-ivory/75 transition-colors hover:text-brand-ivory">Hair Care</Link></li>
              <li><Link to="/ProductListing?category=Skincare" className="text-brand-ivory/75 transition-colors hover:text-brand-ivory">Skincare</Link></li>
              <li><Link to="/ProductListing?category=Face%20Care" className="text-brand-ivory/75 transition-colors hover:text-brand-ivory">Face Care</Link></li>
              <li><Link to="/ProductListing?category=Lip%20Care" className="text-brand-ivory/75 transition-colors hover:text-brand-ivory">Lip Care</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="ga-eyebrow mb-4 text-[10px] text-brand-accent">Customer Care</h3>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link to="/help-center" className="text-brand-ivory/75 transition-colors hover:text-brand-ivory">FAQs</Link></li>
              <li><Link to="/shipping-policy" className="text-brand-ivory/75 transition-colors hover:text-brand-ivory">Shipping Policy</Link></li>
              <li><Link to="/policies" className="text-brand-ivory/75 transition-colors hover:text-brand-ivory">Return Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-brand-ivory/75 transition-colors hover:text-brand-ivory">Terms &amp; Conditions</Link></li>
              <li><Link to="/privacy-policy" className="text-brand-ivory/75 transition-colors hover:text-brand-ivory">Privacy Policy</Link></li>
              <li><Link to="/order-tracking" className="text-brand-ivory/75 transition-colors hover:text-brand-ivory">Track Order</Link></li>
            </ul>
          </div>

          {/* Secure payments + contact */}
          <div>
            <h3 className="ga-eyebrow mb-4 text-[10px] text-brand-accent">Secure Payments</h3>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((method) => (
                <span
                  key={method}
                  className="rounded-md border border-brand-ivory/20 bg-brand-ivory/5 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-brand-ivory/70"
                >
                  {method}
                </span>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-2 text-[11px] text-brand-ivory/70">
              <FiShield className="text-[12px] text-brand-accent" /> 100% secure checkout
            </p>

            <div className="mt-5 space-y-2 text-[12px] text-brand-ivory/75">
              <a href="tel:+917359230538" className="flex items-center gap-2 hover:text-brand-ivory">
                <FiPhone className="text-[13px] text-brand-accent" /> +91 73592 30538
              </a>
              <a href="mailto:glowalchemy67@gmail.com" className="flex items-center gap-2 hover:text-brand-ivory">
                <FiMail className="text-[13px] text-brand-accent" /> glowalchemy67@gmail.com
              </a>
              <p className="flex items-start gap-2 text-brand-ivory/75">
                <FiMapPin className="mt-0.5 flex-shrink-0 text-[13px] text-brand-accent" />
                Sarthana, Varachha, Surat, Gujarat
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-brand-ivory/15 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-[11.5px] text-brand-ivory/70">
            © 2026 {getBrandDisplayName()}. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11.5px] text-brand-ivory/70">
            <Link to="/privacy-policy" className="hover:text-brand-ivory">Privacy</Link>
            <Link to="/terms-of-service" className="hover:text-brand-ivory">Terms</Link>
            <Link to="/shipping-policy" className="hover:text-brand-ivory">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
