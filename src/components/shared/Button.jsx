import React from 'react';
import { FiLoader } from 'react-icons/fi';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-trozzi-terracotta text-white hover:bg-trozzi-charcoal focus:ring-trozzi-terracotta/50',
    secondary: 'bg-trozzi-charcoal text-white hover:bg-trozzi-warm-gray focus:ring-trozzi-charcoal/50',
    outline: 'border-2 border-trozzi-terracotta text-trozzi-terracotta hover:bg-trozzi-terracotta hover:text-white focus:ring-trozzi-terracotta/50',
    ghost: 'text-trozzi-charcoal hover:bg-trozzi-ivory focus:ring-trozzi-sand/50',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm sm:text-base',
    lg: 'px-6 py-3 text-base sm:text-lg',
    xl: 'px-8 py-4 text-lg sm:text-xl',
  };
  
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;
  
  const isDisabled = disabled || loading;
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <FiLoader className="animate-spin mr-2" />
      )}
      {children}
    </button>
  );
};

export default Button;