import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiHeart, FiUser } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useContentSettings } from '../../context/ContentSettingsContext';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 3,
    padding: '0 4px',
    fontSize: 10,
    minWidth: 16,
    height: 16,
    lineHeight: '16px',
  },
}));

const MobileBottomNav = () => {
  const location = useLocation();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { settings } = useContentSettings();

  const wishlistBadgeCount = settings?.showWishlistCount ? wishlistCount : 0;

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/ProductListing', icon: FiShoppingBag, label: 'Shop' },
    { path: '/wishlist', icon: FiHeart, label: 'Wishlist', badge: wishlistBadgeCount },
    { path: '/account', icon: FiUser, label: 'Account' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-glowalchemy-sand z-mobile-nav pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 min-w-0 h-full"
            >
              <div className="relative">
                {item.badge > 0 ? (
                  <StyledBadge badgeContent={item.badge} color="secondary">
                    <Icon
                      className={`text-xl ${
                        active ? 'text-glowalchemy-terracotta' : 'text-glowalchemy-warm-gray'
                      }`}
                    />
                  </StyledBadge>
                ) : (
                  <Icon
                    className={`text-xl ${
                      active ? 'text-glowalchemy-terracotta' : 'text-glowalchemy-warm-gray'
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium ${
                  active ? 'text-glowalchemy-terracotta' : 'text-glowalchemy-warm-gray'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
