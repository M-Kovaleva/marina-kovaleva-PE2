import { Star } from 'lucide-react'
import styles from './RatingBadge.module.css'

interface RatingBadgeProps {
  rating: number
  /** "small" for venue cards, "medium" for the venue page */
  size?: 'small' | 'medium'
}

/** ★ 4.5, or "New" when the venue has no rating yet */
function RatingBadge({ rating, size = 'medium' }: RatingBadgeProps) {
  if (rating <= 0) return <span className={styles.new}>New</span>

  const value = rating.toFixed(1)
  return (
    <span
      className={`${styles.rating} ${styles[size]}`}
      role="img"
      aria-label={`Rated ${value} out of 5`}
    >
      <Star size={size === 'small' ? 16 : 18} aria-hidden="true" />
      {value}
    </span>
  )
}

export default RatingBadge
