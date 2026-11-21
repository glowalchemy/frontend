import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { FiShoppingBag } from 'react-icons/fi';

const UserMenu = ({ onNavigate, onDark = false }) => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
        onNavigate?.();
    };

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Link
                    to="/login"
                    className={
                        onDark
                            ? 'rounded-full border border-brand-ivory/40 px-4 py-2 text-sm font-medium text-brand-ivory transition-colors hover:bg-white/10'
                            : 'rounded-full border border-brand-primary px-4 py-2 text-sm font-medium text-brand-primary transition-colors hover:bg-brand-surface-muted'
                    }
                >
                    Sign In
                </Link>
                <Link
                    to="/register"
                    className={
                        onDark
                            ? 'rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-champagne'
                            : 'rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-brand-ivory transition-colors hover:bg-brand-primary-hover'
                    }
                >
                    Sign Up
                </Link>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                className={
                    onDark
                        ? 'flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-brand-ivory transition-colors hover:bg-white/10'
                        : 'flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-surface-muted'
                }
            >
                <FaUser className="h-4 w-4" />
                <span>{user.firstName}</span>
            </button>

            {isOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-brand-surface rounded-xl shadow-lg py-2 z-dropdown border border-brand-line">
                    <div className="px-4 py-2 border-b border-brand-line">
                        <p className="text-sm font-medium text-brand-ink truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-brand-muted truncate">{user.email}</p>
                    </div>
                    <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-brand-ink hover:bg-brand-surface-muted"
                        onClick={() => {
                            setIsOpen(false);
                            onNavigate?.();
                        }}
                    >
                        <FaUser className="mr-3 h-4 w-4" />
                        My Profile
                    </Link>
                    <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-sm text-brand-ink hover:bg-brand-surface-muted"
                        onClick={() => {
                            setIsOpen(false);
                            onNavigate?.();
                        }}
                    >
                        <FiShoppingBag className="mr-3 h-4 w-4" />
                        My Orders
                    </Link>
                    <div className="border-t border-brand-line mt-1 pt-1">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-brand-error hover:bg-brand-error/10"
                        >
                            <FaSignOutAlt className="mr-3 h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
