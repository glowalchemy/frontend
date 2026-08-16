import React from 'react';

const Container = ({ children, className = '', size = 'default', ...props }) => {
  const sizeClasses = {
    default: 'max-w-7xl',
    narrow: 'max-w-5xl',
    wide: 'max-w-[1400px]',
    full: 'max-w-full',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.default;

  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${selectedSize} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;