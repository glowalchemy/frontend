import React, { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import GlobalSearch from "./GlobalSearch";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { FiShoppingCart, FiHeart, FiMenu, FiSearch, FiX, FiShoppingBag, FiHome, FiPackage, FiInfo, FiPhone } from "react-icons/fi";
import Tooltip from "@mui/material/Tooltip";
import UserMenu from "./UserMenu";
import Navigation from "./Navigation";
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useContentSettings } from '../../context/ContentSettingsContext';

import CartDrawer from '../CartPanel/CartDrawer';
import NotificationBell from './NotificationBell';
import { getBrandDisplayName, getBrandTagline } from '../../config/brand';

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
  [theme.breakpoints.down('sm')]: {
    "& .MuiBadge-badge": {
      right: -2,
      top: 10,
      padding: "0 3px",
      fontSize: 10,
      minWidth: 16,
      height: 16,
      lineHeight: '16px',
    },
  },
}));

const Header = forwardRef(({ hidden = false, elevated = false }, ref) => {
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { settings } = useContentSettings();

  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [totalHeaderHeight, setTotalHeaderHeight] = useState(0);

  const headerClassName = useMemo(() => {
    const base = "bg-trozzi-white border-b border-trozzi-sand sticky top-0 left-0 right-0 z-header transition-shadow duration-300 ease-out";
    const shadow = elevated ? "shadow-md" : "shadow-none";
    return `${base} ${shadow}`;
  }, [elevated]);

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
  // (Tracking the previous pathname avoids the self-close that happens when
  // the open/close state itself is part of the dependency array.)
  const prevPathname = useRef(location.pathname);
  useEffect(() => {
    if (prevPathname.current !== location.pathname) {
      prevPathname.current = location.pathname;
      setIsMobileMenuOpen(false);
      setIsMobileSearchOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(min-width: 768px)');
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

  // Measure total header height including navigation
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const headerHeight = el.offsetHeight || 0;
      setTotalHeaderHeight(headerHeight);
      // Update CSS variable for parent components
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

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen((prev) => !prev);
  };

  const mobileMenuNode =
    isMobileMenuOpen && typeof document !== 'undefined' && document?.body
      ? createPortal(
        <div
          className="md:hidden fixed inset-0 z-mobile-menu bg-black/60 backdrop-blur-sm"
          onClick={toggleMobileMenu}
        >
          <div
            className="fixed inset-0 w-full bg-page-primary shadow-2xl overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 pb-10 bg-page-primary">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-default">
                <div>
                  <h2 className="text-xl font-bold text-action-primary">Menu</h2>
                  <p className="text-sm text-muted">Browse our store</p>
                </div>

                <button
                  onClick={toggleMobileMenu}
                  className="text-2xl text-action-primary hover:bg-action-accent-soft p-2 rounded-xl transition-colors"
                >
                  <FiX />
                </button>
              </div>

              {/* User Menu Mobile */}
              <div className="mb-6 pb-6 border-b border-default">
                <UserMenu onNavigate={() => setIsMobileMenuOpen(false)} />
              </div>

              {/* Mobile Navigation Links */}
              <nav className="space-y-2">
                {[
                  { to: '/', label: 'Home', icon: <FiHome className="w-5 h-5" /> },
                  { to: '/ProductListing', label: 'Shop', icon: <FiShoppingBag className="w-5 h-5" /> },
                  { to: '/wishlist', label: 'Wishlist', icon: <FiHeart className="w-5 h-5" /> },
                  { to: '/orders', label: 'Orders', icon: <FiPackage className="w-5 h-5" /> },
                  { to: '/about', label: 'About Us', icon: <FiInfo className="w-5 h-5" /> },
                  { to: '/contact', label: 'Contact', icon: <FiPhone className="w-5 h-5" /> },
                ].map((item) => {
                  const active = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={toggleMobileMenu}
                      className={`flex items-center gap-3 text-base font-medium px-4 py-3 rounded-xl transition-colors ${
                        active
                          ? 'bg-page-secondary text-action-primary border-l-2 border-action-accent'
                          : 'text-charcoal hover:text-action-primary hover:bg-page-secondary'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Bottom Links */}
              <div className="mt-6 pt-6 border-t border-default space-y-3">
                <Link
                  to="/help-center"
                  onClick={toggleMobileMenu}
                  className="block text-sm text-muted hover:text-action-primary px-4 py-2 hover:bg-page-secondary rounded-lg transition-colors"
                >
                  Help Center
                </Link>
                <Link
                  to="/order-tracking"
                  onClick={toggleMobileMenu}
                  className="block text-sm text-muted hover:text-action-primary px-4 py-2 hover:bg-page-secondary rounded-lg transition-colors"
                >
                  Order Tracking
                </Link>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
      : null;

  return (
    <header ref={ref} className={headerClassName}>
      {/* MAIN HEADER */}
      <div className="header bg-trozzi-white">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">            <div className="py-2 md:py-3">
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile search mode: full-width field with back — replaces the brand row so the
                  header height stays constant and nothing feels cramped or duplicated. */}
              {!isDesktop && isMobileSearchOpen ? (
                <GlobalSearch onBack={() => setIsMobileSearchOpen(false)} autoFocus />
              ) : (
                <>
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden w-9 h-9 flex items-center justify-center text-[22px] text-action-primary active:scale-[0.98] transition-transform"
                type="button"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <FiX /> : <FiMenu />}
              </button>

              {/* Brand — LogoLink > (circular LogoMark + wordmark) */}
              <Link
                to="/"
                className="flex items-center gap-2 flex-shrink-0 min-w-0"
                aria-label={getBrandDisplayName()}
              >
                <span className="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 flex-shrink-0">
                  <img
                    src={settings?.brandLogoUrl || '/logo.png'}
                    alt=""
                    className="w-full h-full object-contain"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </span>
                <span className="flex flex-col leading-none min-w-0">
                  <span className="font-serif font-bold text-action-primary text-base md:text-xl tracking-tight whitespace-nowrap">
                    {getBrandDisplayName()}
                  </span>
                  <span className="hidden sm:block text-[10px] md:text-[11px] text-muted uppercase tracking-[0.18em] mt-1 whitespace-nowrap">
                    {getBrandTagline()}
                  </span>
                </span>
              </Link>

              {/* Desktop Search */}
              {isDesktop ? (
                <div className="flex flex-1 min-w-0 justify-center px-4">
                  <div className="w-full max-w-2xl">
                    <GlobalSearch />
                  </div>
                </div>
              ) : null}

              {/* Actions */}
              <div className="ml-auto flex items-center gap-1 md:gap-2">
                {!isDesktop && (
                  <Tooltip title="Search" arrow>
                    <IconButton
                      aria-label="search"
                      onClick={toggleMobileSearch}
                      className="!w-9 !h-9 hover:bg-trozzi-ivory transition-colors rounded-xl"
                    >
                      {isMobileSearchOpen ? (
                        <FiX className="text-lg text-trozzi-charcoal" />
                      ) : (
                        <FiSearch className="text-lg text-trozzi-charcoal" />
                      )}
                    </IconButton>
                  </Tooltip>
                )}

                <div className="hidden md:block">
                  <UserMenu />
                </div>

                <div className="hidden md:block">
                  <NotificationBell />
                </div>

                <Tooltip title="Cart" arrow>
                  <IconButton
                    aria-label="cart"
                    onClick={toggleCart}
                    className="!w-9 !h-9 sm:!w-11 sm:!h-11 hover:bg-trozzi-ivory transition-colors rounded-xl"
                  >
                    <StyledBadge badgeContent={itemCount} color="secondary">
                      <FiShoppingCart className="text-lg sm:text-xl md:text-2xl text-trozzi-charcoal" />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>

                <Tooltip title="Wishlist" arrow>
                  <Link to="/wishlist" className="hidden md:inline-flex">
                    <IconButton
                      aria-label="wishlist"
                      className="!w-9 !h-9 sm:!w-11 sm:!h-11 hover:bg-trozzi-ivory transition-colors rounded-xl"
                    >
                      <StyledBadge badgeContent={wishlistBadgeCount} color="secondary">
                        <FiHeart className="text-lg sm:text-xl md:text-2xl text-trozzi-charcoal" />
                      </StyledBadge>
                    </IconButton>
                  </Link>
                </Tooltip>

                <Tooltip title="My Orders" arrow>
                  <Link to="/orders" className="hidden md:inline-flex">
                    <IconButton
                      aria-label="orders"
                      className="!w-9 !h-9 sm:!w-11 sm:!h-11 hover:bg-trozzi-ivory transition-colors rounded-xl"
                    >
                      <FiShoppingBag className="text-lg sm:text-xl md:text-2xl text-trozzi-charcoal" />
                    </IconButton>
                  </Link>
                </Tooltip>
              </div>
              </>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Desktop */}
      <div className="hidden md:block bg-trozzi-white border-t border-trozzi-sand relative z-dropdown">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Navigation />
        </div>
      </div>

      {mobileMenuNode}

      {/* Cart Drawer */}
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
});

export default Header;