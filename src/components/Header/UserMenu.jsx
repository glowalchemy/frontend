import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { FiShoppingBag } from 'react-icons/fi';

const UserMenu = ({ onNavigate }) => {
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
            <div className="flex items-center space-x-4">
                <Link
                    to="/login"
                    className="text-charcoal hover:text-action-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                    Sign In
                </Link>
                <Link
                    to="/register"
                    className="bg-action-primary text-white hover:bg-action-primary-hover px-4 py-2 rounded-md text-sm font-medium"
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
                className="flex items-center space-x-2 text-charcoal hover:text-action-primary px-3 py-2 rounded-md text-sm font-medium"
            >
                <FaUser className="h-4 w-4" />
                <span>{user.firstName}</span>
            </button>

            {isOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-surface rounded-md shadow-lg py-2 z-dropdown">
                    <div className="px-4 py-2 border-b border-default">
                        <p className="text-sm font-medium text-charcoal">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-muted">{user.email}</p>
                    </div>
                    <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-charcoal hover:bg-page-secondary"
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
                        className="flex items-center px-4 py-2 text-sm text-charcoal hover:bg-page-secondary"
                        onClick={() => {
                            setIsOpen(false);
                            onNavigate?.();
                        }}
                    >
                        <FiShoppingBag className="mr-3 h-4 w-4" />
                        My Orders
                    </Link>
                    <div className="border-t border-default mt-1 pt-1">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-status-error hover:bg-status-error/10"
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
