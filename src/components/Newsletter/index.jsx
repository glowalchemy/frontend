import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { FiMail, FiArrowRight } from 'react-icons/fi';

const SOCIALS = [
  { href: 'https://facebook.com', label: 'Facebook', Icon: FaFacebookF },
  { href: 'https://instagram.com', label: 'Instagram', Icon: FaInstagram },
  { href: 'https://twitter.com', label: 'Twitter', Icon: FaTwitter },
  { href: 'https://linkedin.com', label: 'LinkedIn', Icon: FaLinkedinIn },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const Newsletter = () => {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState('idle');
  const [message, setMessage] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    setStatus('success');
    setMessage('Thank you for subscribing — welcome to the GlowAlchemy ritual.');
    setEmail('');
  };

  return (
    <section className="ga-newsletter relative overflow-hidden">
      <div className="ga-container py-12 md:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="flex items-start gap-4 sm:items-center">
            <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-pink-soft">
              <FiMail className="text-xl" aria-hidden="true" />
            </span>
            <div>
              <h2 className="ga-serif text-[24px] leading-tight text-white sm:text-[30px]">
                Subscribe to our Newsletter
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-white/70">
                Join the GlowAlchemy circle for skincare rituals, beauty edits and early access to new
                launches.
              </p>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status !== 'idle') {
                    setStatus('idle');
                    setMessage('');
                  }
                }}
                placeholder="Enter your email address"
                aria-invalid={status === 'error'}
                aria-describedby="newsletter-message"
                className="min-w-0 flex-1 rounded-full border border-white/25 bg-white px-5 py-3.5 text-[13.5px] text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none focus:border-white focus:ring-2 focus:ring-white/40"
              />
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-text)] px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white hover:text-burgundy"
              >
                Subscribe
                <FiArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>

            <p
              id="newsletter-message"
              role="status"
              aria-live="polite"
              className={`mt-2 min-h-[18px] text-[12px] ${
                status === 'error' ? 'text-[var(--color-champagne-soft)]' : 'text-white/80'
              }`}
            >
              {message}
            </p>

            <div className="mt-3 flex items-center gap-3">
              <span className="ga-eyebrow text-[10px] text-white/50">Follow Us</span>
              <span className="h-px w-6 bg-white/20" aria-hidden="true" />
              <div className="flex items-center gap-2">
                {SOCIALS.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white hover:bg-white hover:text-burgundy"
                  >
                    <Icon className="text-[12px]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
