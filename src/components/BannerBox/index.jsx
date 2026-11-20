import React from 'react'
import { Link } from 'react-router-dom'

const BannerBox = (props) => {
  return (
    <div className='Box bannerbox overflow-hidden rounded-lg group relative aspect-[3/2] bg-[#f3efe8]'>
      {/* Blurred backdrop reuses the same cached image URL — fills letterbox
          space without a second download; foreground stays fully visible. */}
      <div
        className='absolute inset-0 bg-center bg-cover blur-xl scale-110 brightness-[0.9]'
        style={{ backgroundImage: `url(${props.img})` }}
        aria-hidden="true"
      />
      <Link to={props.link || '/'} className='relative z-10 block h-full'>
        <img
          src={props.img}
          className='w-full h-full object-contain group-hover:scale-105 duration-300 transition-transform ease-in-out'
          alt="banner"
          loading="lazy"
          decoding="async"
        />
      </Link>
    </div>
  )
}

export default BannerBox
