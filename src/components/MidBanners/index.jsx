import React, { useEffect, useState } from 'react'
import BannerBox from '../BannerBox'
import { fetchBanners } from '../../api/catalog'

// Static row of mid-page banners (position: home_mid_banners).
// Renders nothing when no active banners exist — no blank section.
const MidBanners = () => {
  const [items, setItems] = useState([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await fetchBanners({ position: 'home_mid_banners' })
        if (!cancelled) setItems(Array.isArray(data) ? data : [])
      } catch (e) {
        if (!cancelled) setItems([])
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (items.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 mt-6 sm:mt-8">
      {items.slice(0, 8).map((b) => (
        <BannerBox
          key={b.id}
          img={b.imageUrl}
          link={b.linkUrl}
          variants={b.imageMedia?.variants || null}
          width={b.imageMedia?.width || null}
          height={b.imageMedia?.height || null}
        />
      ))}
    </div>
  )
}

export default MidBanners
