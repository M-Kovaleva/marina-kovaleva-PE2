import { useState } from 'react'
import VenueImage from './VenueImage'
import type { Media } from '../types/venue'
import styles from './VenueGallery.module.css'

interface VenueGalleryProps {
  media: Media[]
  name: string
}

/**
 * Big photo + thumbnails. A click on a thumbnail shows that photo big
 */
function VenueGallery({ media, name }: VenueGalleryProps) {
  const [selected, setSelected] = useState(0)
  const hasThumbs = media.length > 1

  return (
    <div className={`${styles.gallery} ${hasThumbs ? styles.withThumbs : ''}`}>
      <div className={styles.main}>
        <VenueImage
          media={media[selected]}
          fallbackAlt={name}
          className={styles.mainImage}
          loading="eager"
        />
        {hasThumbs && (
          <span className={styles.counter}>
            {selected + 1} / {media.length}
          </span>
        )}
      </div>

      {hasThumbs && (
        <ul className={styles.thumbs} aria-label="Photos">
          {media.map((item, index) => (
            <li key={`${item.url}-${index}`}>
              <button
                type="button"
                className={styles.thumb}
                aria-label={`Show photo ${index + 1} of ${media.length}`}
                aria-current={index === selected}
                onClick={() => setSelected(index)}
              >
                <VenueImage media={item} fallbackAlt={name} className={styles.thumbImage} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default VenueGallery
