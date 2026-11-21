import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, NavLink } from "react-router-dom";
import GlobalSearch from "./GlobalSearch";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import {
  FiShoppingCart,
  FiHeart,
  FiMenu,
  FiSearch,
  FiX,
  FiShoppingBag,
  FiHome,
  FiPackage,
  FiInfo,
  FiPhone,
  FiUser,
  FiTruck,
  FiSun,
  FiGrid,
  FiChevronRight,
} from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import UserMenu from "./UserMenu";
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useContentSettings } from '../../context/ContentSettingsContext';

import CartDrawer from '../CartPanel/CartDrawer';
import NotificationBell from './NotificationBell';
import { getBrandDisplayName, getBrandTagline } from '../../config/brand';

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -2,
    top: 12,
    backgroundColor: (theme.vars ?? theme).palette.secondary.main,
    color: (theme.vars ?? theme).palette.secondary.contrastText,
    border: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    padding: "0 4px",
    fontSize: 10,
    minWidth: 18,
    height: 18,
    lineHeight: '18px',
    fontWeight: 700,
  },
}));

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/ProductListing', label: 'Products' },
  { to: '/about', label: 'About Us' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

const MOBILE_LINKS = [
  { to: '/', label: 'Home', icon: <FiHome className="w-5 h-5" /> },
  { to: '/ProductListing', label: 'Shop All Products', icon: <FiShoppingBag className="w-5 h-5" /> },
  { to: '/wishlist', label: 'Wishlist', icon: <FiHeart className="w-5 h-5" /> },
  { to: '/orders', label: 'My Orders', icon: <FiPackage className="w-5 h-5" /> },
  { to: '/about', label: 'About Us', icon: <FiInfo className="w-5 h-5" /> },
  { to: '/blog', label: 'Blog', icon: <FiGrid className="w-5 h-5" /> },
  { to: '/contact', label: 'Contact', icon: <FiPhone className="w-5 h-5" /> },
];

const Header = forwardRef(({ hidden = false, elevated = false }, ref) => {
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { settings } = useContentSettings();

  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const wishlistBadgeCount = settings?.showWishlistCount ? wishlistCount : 0;

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isMobileMenuOpen]);

  // Close the mobile overlays only when the route actually changes.
  const prevPathname = useRef(location.pathname);
  useEffect(() => {
    if (prevPathname.current !== location.pathname) {
      prevPathname.current = location.pathname;
      setIsMobileMenuOpen(false);
      setIsMobileSearchOpen(false);
      setIsDesktopSearchOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(Boolean(mq.matches));
    update();
    try {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    } catch (_e) {
      mq.addListener(update);
      return () => mq.removeListener(update);
    }
  }, []);

  // Measure total header height so sticky offsets elsewhere stay correct.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const headerHeight = el.offsetHeight || 0;
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--app-header-height', `${headerHeight}px`);
      }
    };

    measure();

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => measure());
      ro.observe(el);
    } else {
      window.addEventListener('resize', measure);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', measure);
    };
  }, [ref]);

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const toggleMobileSearch = () => setIsMobileSearchOpen((prev) => !prev);

  const mobileMenuNode =
    isMobileMenuOpen && typeof document !== 'undefined' && document?.body
      ? createPortal(
        <div
          className="lg:hidden fixed inset-0 z-mobile-menu bg-brand-primary-active/70 backdrop-blur-sm"
          onClick={toggleMobileMenu}
        >
          <div
            className="absolute inset-y-0 left-0 w-[84%] max-w-[340px] overflow-y-auto bg-brand-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-brand-line bg-brand-surface-muted px-5 py-5">
              <div>
                <p className="ga-serif text-xl text-brand-primary">{getBrandDisplayName()}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-brand-muted">
                  {getBrandTagline()}
                </p>
              </div>
              <button
                onClick={toggleMobileMenu}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-surface text-brand-ink shadow-sm"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <div className="border-b border-brand-line px-4 py-4">
              <UserMenu onNavigate={() => setIsMobileMenuOpen(false)} />
            </div>

            <nav className="px-3 py-4">
              {MOBILE_LINKS.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={toggleMobileMenu}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-medium transition-colors ${
                      active
                        ? 'bg-brand-surface-muted text-brand-primary'
                        : 'text-brand-ink hover:bg-brand-surface-muted hover:text-brand-primary'
                    }`}
                  >
                    <span className={active ? 'text-brand-primary' : 'text-brand-muted'}>{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    <FiChevronRight className="text-brand-sage" />
                  </Link>
                );
              })}
            </nav>

            <div className="mx-4 rounded-2xl bg-brand-surface-muted p-4">
              <p className="ga-eyebrow mb-3 text-[10px] text-brand-primary">Business Services</p>
              {[
                { to: '/services', label: 'All Services' },
                { to: '/services/private-labeling', label: 'Private Labeling' },
                { to: '/services/third-party-manufacturing', label: 'Third-Party Manufacturing' },
                { to: '/services/contract-manufacturing', label: 'Contract Manufacturing' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={toggleMobileMenu}
                  className="flex items-center justify-between py-2 text-[13px] text-brand-muted hover:text-brand-primary"
                >
                  {item.label}
                  <FiChevronRight className="text-brand-sage" />
                </Link>
              ))}
            </div>

            <div className="mt-4 border-t border-brand-line px-5 py-5">
              <a
                href="tel:+917359230538"
                className="flex items-center justify-center gap-2 rounded-full bg-brand-primary px-4 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-brand-ivory"
              >
                <FiPhone /> Call +91 73592 30538
              </a>
              <div className="mt-3 flex justify-center gap-4 text-[12px] text-brand-muted">
                <Link to="/help-center" onClick={toggleMobileMenu} className="hover:text-brand-primary">
                  Help Center
                </Link>
                <Link to="/order-tracking" onClick={toggleMobileMenu} className="hover:text-brand-primary">
                  Track Order
                </Link>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
      : null;

  return (
    <header
      ref={ref}
      className={`sticky left-0 right-0 top-0 z-header bg-brand-primary text-brand-ivory transition-shadow duration-300 ${
        elevated ? 'shadow-[0_10px_30px_rgba(13,41,29,0.35)]' : 'shadow-none'
      } ${hidden ? 'hidden' : ''}`}
    >
      {/* ANNOUNCEMENT BAR */}
      <div
        className={`overflow-hidden bg-brand-primary-active text-brand-champagne-soft transition-all duration-300 ${
          elevated ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'
        }`}
        aria-hidden={elevated}
      >
        <div className="ga-container flex h-9 items-center justify-center gap-6 md:justify-between">
          <span className="inline-flex items-center gap-2 text-[10.5px] tracking-wide sm:text-[11.5px]">
            <FiTruck className="text-[13px] text-brand-champagne" aria-hidden="true" />
            Free Shipping on Orders Above ₹999
          </span>
          <span className="hidden items-center gap-2 text-[11.5px] tracking-wide sm:inline-flex">
            <FaLeaf className="text-[12px] text-brand-champagne" aria-hidden="true" />
            100% Natural &amp; Safe
          </span>
          <span className="hidden items-center gap-2 text-[11.5px] tracking-wide md:inline-flex">
            <FiSun className="text-[13px] text-brand-champagne" aria-hidden="true" />
            Glow Naturally, Live Beautifully
          </span>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="border-b border-white/10 bg-brand-primary">
        <div className="ga-container">
          <div className="flex h-16 items-center gap-2 md:h-[78px] md:gap-4">
            {!isDesktop && isMobileSearchOpen ? (
              <GlobalSearch onBack={() => setIsMobileSearchOpen(false)} autoFocus />
            ) : (
              <>
                {/* Mobile menu */}
                <button
                  onClick={toggleMobileMenu}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-brand-ivory transition-colors hover:bg-white/10 lg:hidden"
                  type="button"
                  aria-label="Open menu"
                >
                  {isMobileMenuOpen ? <FiX className="text-[22px]" /> : <FiMenu className="text-[22px]" />}
                </button>

                {/* Brand */}
                <Link to="/" className="flex min-w-0 flex-shrink-0 items-center gap-2.5" aria-label={getBrandDisplayName()}>
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-ivory p-1 md:h-12 md:w-12">
                    <img
                      src={settings?.brandLogoUrl || '/logo.png'}
                      alt=""
                      className="h-full w-full object-contain"
                      loading="eager"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </span>
                  <span className="flex min-w-0 flex-col leading-none">
                    <span className="ga-serif whitespace-nowrap text-[19px] font-semibold tracking-tight text-brand-ivory md:text-[23px]">
                      {getBrandDisplayName()}
                    </span>
                    <span className="mt-1 hidden text-[9px] uppercase tracking-[0.2em] text-brand-champagne/80 sm:block">
                      {getBrandTagline()}
                    </span>
                  </span>
                </Link>

                {/* Desktop navigation (centre) */}
                <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Main navigation">
                  {NAV_LINKS.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === '/'}
                      className={({ isActive }) =>
                        `relative px-4 py-2 text-[12.5px] font-medium uppercase tracking-[0.14em] transition-colors ${
                          isActive ? 'text-brand-ivory' : 'text-brand-ivory/75 hover:text-brand-ivory'
                        } after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-brand-accent after:transition-all after:duration-300 hover:after:w-6 ${
                          isActive ? 'after:w-6' : ''
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </nav>

                {/* Actions */}
                <div className="ml-auto flex items-center gap-0.5 md:gap-1.5">
                  {!isDesktop && (
                    <button
                      type="button"
                      aria-label="Search"
                      onClick={toggleMobileSearch}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-brand-ivory transition-colors hover:bg-white/10"
                    >
                      {isMobileSearchOpen ? <FiX className="text-[20px]" /> : <FiSearch className="text-[20px]" />}
                    </button>
                  )}

                  {isDesktop && (
                    <Tooltip title="Search" arrow>
                      <IconButton
                        aria-label="search"
                        onClick={() => setIsDesktopSearchOpen((prev) => !prev)}
                        className="!h-10 !w-10 hover:!bg-white/10"
                      >
                        {isDesktopSearchOpen ? (
                          <FiX className="text-[20px] text-brand-ivory" />
                        ) : (
                          <FiSearch className="text-[20px] text-brand-ivory" />
                        )}
                      </IconButton>
                    </Tooltip>
                  )}

                  <div className="hidden md:block">
                    <UserMenu onDark />
                  </div>

                  <div className="hidden xl:block">
                    <NotificationBell />
                  </div>

                  <Tooltip title="Wishlist" arrow>
                    <Link to="/wishlist" className="hidden md:inline-flex" aria-label="Wishlist">
                      <IconButton className="!h-10 !w-10 hover:!bg-white/10">
                        <StyledBadge badgeContent={wishlistBadgeCount} color="secondary">
                          <FiHeart className="text-[20px] text-brand-ivory" />
                        </StyledBadge>
                      </IconButton>
                    </Link>
                  </Tooltip>

                  <Tooltip title="Cart" arrow>
                    <IconButton
                      aria-label="cart"
                      onClick={toggleCart}
                      className="!h-10 !w-10 hover:!bg-white/10"
                    >
                      <StyledBadge badgeContent={itemCount} color="secondary">
                        <FiShoppingCart className="text-[20px] text-brand-ivory" />
                      </StyledBadge>
                    </IconButton>
                  </Tooltip>

                  <Link
                    to="/orders"
                    className="hidden h-10 w-10 items-center justify-center rounded-full text-brand-ivory transition-colors hover:bg-white/10 lg:flex"
                    aria-label="My orders"
                  >
                    <FiUser className="text-[20px]" />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Desktop search panel */}
        {isDesktop && isDesktopSearchOpen ? (
          <div className="border-t border-white/10 bg-brand-surface">
            <div className="ga-container py-4">
              <div className="mx-auto max-w-3xl">
                <GlobalSearch />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {mobileMenuNode}

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
});

export default Header;
