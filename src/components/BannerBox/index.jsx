import React from 'react'
import { Link } from 'react-router-dom'
import BannerImage from '../BannerImage';

const BannerBox = (props) => {
  return (
    <Link to={props.link || '/'} className="block">
      <BannerImage
        src={props.img}
        alt="banner"
        className="rounded-lg overflow-hidden group"
        imgClassName="group-hover:scale-105 duration-300 transition-transform ease-in-out"
      />
    </Link>
  )
}

export default BannerBox
