import React from 'react'
import { Link } from 'react-router-dom'
import BannerImage from '../BannerImage';

// One promo banner tile. `variants`/`width`/`height` come from the banner API
// so the tile's aspect ratio is reserved from metadata (no layout shift) and
// mobile requests a small AVIF/WebP instead of the desktop original.
const BannerBox = ({ img, link, variants = null, width = null, height = null, alt = 'banner' }) => {
  return (
    <Link to={link || '/'} className="block">
      <BannerImage
        src={img}
        variants={variants}
        width={width}
        height={height}
        alt={alt}
        sizes="(min-width: 1024px) 25vw, 50vw"
        className="rounded-lg overflow-hidden group"
        imgClassName="group-hover:scale-105 duration-300 transition-transform ease-in-out"
      />
    </Link>
  )
}

export default BannerBox;
