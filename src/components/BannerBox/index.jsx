import React from 'react'
import { Link } from 'react-router-dom'

const BannerBox = (props) => {
  return (
    <div className='Box bannerbox overflow-hidden rounded-lg group'>
      <Link to={props.link || '/'}>
        <img
          src={props.img}
          className='w-full h-auto object-contain group-hover:scale-105 duration-300 transition-transform ease-in-out'
          alt="banner"
          loading="lazy"
          decoding="async"
        />
      </Link>
    </div>
  )
}

export default BannerBox
