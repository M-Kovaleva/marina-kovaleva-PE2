import { useState } from 'react'
import { House } from 'lucide-react'
import type { Media } from '../types/venue'
import styles from './VenueImage.module.css'

interface VenueImageProps {
  media?: Media
  fallbackAlt: string
  className?: string
  /** "eager" for the first photo on the screen, so it is not delayed */
  loading?: 'lazy' | 'eager'
}

/**
 * Venue photo. Shows a "No photo yet" placeholder when there is no image
 * or the image URL is broken
 */
function VenueImage({ media, fallbackAlt, className = '', loading = 'lazy' }: VenueImageProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const url = media?.url

  if (!url || url === failedUrl) {
    return (
      <div
        className={`${styles.image} ${styles.placeholder} ${className}`}
        role="img"
        aria-label={`${fallbackAlt}, no photo yet`}
      >
        <House size={32} aria-hidden="true" />
        <span>No photo yet</span>
      </div>
    )
  }

  return (
    <img
      className={`${styles.image} ${className}`}
      src={url}
      alt={media.alt || fallbackAlt}
      loading={loading}
      onError={() => setFailedUrl(url)}
    />
  )
}

export default VenueImage
