import React from 'react';
import { FiPackage, FiShoppingCart, FiHeart, FiSearch, FiInbox } from 'react-icons/fi';

const EmptyState = ({ 
    icon = 'package', 
    title = 'No items found', 
    description = 'There are no items to display at the moment.',
    actionText,
    onAction,
    className = ''
}) => {
    const icons = {
        package: FiPackage,
        cart: FiShoppingCart,
        heart: FiHeart,
        search: FiSearch,
        inbox: FiInbox,
    };

    const Icon = icons[icon] || FiPackage;

    return (
        <div className={`flex flex-col items-center justify-center py-8 sm:py-12 px-4 ${className}`}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-trozzi-ivory flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-trozzi-sand" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-trozzi-charcoal mb-2 text-center">
                {title}
            </h3>
            <p className="text-sm sm:text-base text-trozzi-warm-gray text-center max-w-sm mb-6">
                {description}
            </p>
            {actionText && onAction && (
                <button
                    onClick={onAction}
                    className="bg-trozzi-terracotta text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-trozzi-charcoal transition-colors font-medium text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
                >
                    {actionText}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
