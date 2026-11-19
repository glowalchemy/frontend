import React, { useState } from 'react';
import { FiImage, FiPackage } from 'react-icons/fi';
import { getBrandDisplayName } from '../../config/brand';

const ImageWithFallback = ({
  src,
  alt,
  className = '',
  fallbackType = 'product',
  aspectRatio = 'auto',
  ...props
}) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleError = () => {
    setImgError(true);
  };

  const handleLoad = () => {
    setImgLoaded(true);
  };

  // Fallback styles based on type
  const getFallbackStyles = () => {
    const base = 'flex flex-col items-center justify-center bg-glowalchemy-sand/30';
    switch (fallbackType) {
      case 'product':
        return `${base} min-h-[200px] md:min-h-[400px]`;
      case 'card':
        return `${base} h-40 md:h-48`;
      case 'thumbnail':
        return `${base} h-20 w-20`;
      case 'logo':
        return `${base} h-12 w-32`;
      default:
        return `${base} min-h-[100px]`;
    }
  };

  const getFallbackIcon = () => {
    switch (fallbackType) {
      case 'product':
      case 'card':
      case 'thumbnail':
        return <FiPackage className="text-3xl md:text-5xl text-glowalchemy-warm-gray" />;
      case 'logo':
        return <span className="text-2xl font-bold text-glowalchemy-charcoal">{getBrandDisplayName()}</span>;
      default:
        return <FiImage className="text-3xl text-glowalchemy-warm-gray" />;
    }
  };

  const getFallbackText = () => {
    switch (fallbackType) {
      case 'product':
        return 'Image unavailable';
      case 'card':
        return null;
      case 'thumbnail':
        return null;
      case 'logo':
        return null;
      default:
        return 'Image not available';
    }
  };

  if (imgError || !src) {
    return (
      <div 
        className={`${getFallbackStyles()} ${className}`} 
        style={aspectRatio !== 'auto' ? { aspectRatio } : undefined}
        {...props}
      >
        {getFallbackIcon()}
        {getFallbackText() && (
          <span className="mt-2 text-sm text-glowalchemy-warm-gray">{getFallbackText()}</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${!imgLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      style={aspectRatio !== 'auto' ? { aspectRatio } : undefined}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};

export default ImageWithFallback;
