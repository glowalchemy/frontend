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
    <footer className={`${hideOnMobile ? 'hidden md:block' : ''} mt-auto bg-burgundy-deep text-white`}>
      <div className="ga-container py-12 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.15fr] lg:gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                <img
                  src="/logo.png"
                  alt=""
                  className="h-9 w-9 object-contain"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </span>
              <span>
                <span className="ga-serif block text-[22px] leading-none text-white">
                  {getBrandDisplayName()}
                </span>
                <span className="mt-1 block text-[9px] uppercase tracking-[0.2em] text-white/50">
                  {getBrandTagline()}
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-[12.5px] leading-relaxed text-white/65">
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
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-white hover:bg-white hover:text-burgundy"
                >
                  <Icon className="text-[13px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="ga-eyebrow mb-4 text-[10px] text-pink-soft">Quick Links</h3>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link to="/" className="text-white/65 transition-colors hover:text-white">Home</Link></li>
              <li><Link to="/ProductListing" className="text-white/65 transition-colors hover:text-white">Products</Link></li>
              <li><Link to="/about" className="text-white/65 transition-colors hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-white/65 transition-colors hover:text-white">Contact</Link></li>
              <li><Link to="/blog" className="text-white/65 transition-colors hover:text-white">Blog</Link></li>
            </ul>
          </div>

          {/* Our Products */}
          <div>
            <h3 className="ga-eyebrow mb-4 text-[10px] text-pink-soft">Our Products</h3>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link to="/ProductListing?category=Body%20Care" className="text-white/65 transition-colors hover:text-white">Body Care</Link></li>
              <li><Link to="/ProductListing?category=Haircare" className="text-white/65 transition-colors hover:text-white">Hair Care</Link></li>
              <li><Link to="/ProductListing?category=Skincare" className="text-white/65 transition-colors hover:text-white">Skincare</Link></li>
              <li><Link to="/ProductListing?category=Face%20Care" className="text-white/65 transition-colors hover:text-white">Face Care</Link></li>
              <li><Link to="/ProductListing?category=Lip%20Care" className="text-white/65 transition-colors hover:text-white">Lip Care</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="ga-eyebrow mb-4 text-[10px] text-pink-soft">Customer Care</h3>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link to="/help-center" className="text-white/65 transition-colors hover:text-white">FAQs</Link></li>
              <li><Link to="/shipping-policy" className="text-white/65 transition-colors hover:text-white">Shipping Policy</Link></li>
              <li><Link to="/policies" className="text-white/65 transition-colors hover:text-white">Return Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-white/65 transition-colors hover:text-white">Terms &amp; Conditions</Link></li>
              <li><Link to="/privacy-policy" className="text-white/65 transition-colors hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/order-tracking" className="text-white/65 transition-colors hover:text-white">Track Order</Link></li>
            </ul>
          </div>

          {/* Secure payments + contact */}
          <div>
            <h3 className="ga-eyebrow mb-4 text-[10px] text-pink-soft">Secure Payments</h3>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((method) => (
                <span
                  key={method}
                  className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-white/70"
                >
                  {method}
                </span>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-2 text-[11px] text-white/45">
              <FiShield className="text-[12px]" /> 100% secure checkout
            </p>

            <div className="mt-5 space-y-2 text-[12px] text-white/65">
              <a href="tel:+917359230538" className="flex items-center gap-2 hover:text-white">
                <FiPhone className="text-[13px] text-pink-soft" /> +91 73592 30538
              </a>
              <a href="mailto:glowalchemy67@gmail.com" className="flex items-center gap-2 hover:text-white">
                <FiMail className="text-[13px] text-pink-soft" /> glowalchemy67@gmail.com
              </a>
              <p className="flex items-start gap-2">
                <FiMapPin className="mt-0.5 flex-shrink-0 text-[13px] text-pink-soft" />
                Sarthana, Varachha, Surat, Gujarat
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/12 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-[11.5px] text-white/50">
            © 2026 {getBrandDisplayName()}. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11.5px] text-white/50">
            <Link to="/privacy-policy" className="hover:text-white">Privacy</Link>
            <Link to="/terms-of-service" className="hover:text-white">Terms</Link>
            <Link to="/shipping-policy" className="hover:text-white">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
