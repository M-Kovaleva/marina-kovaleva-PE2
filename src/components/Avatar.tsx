import { useState } from 'react'
import styles from './Avatar.module.css'

interface AvatarProps {
  name: string
  url?: string
  /** Alt text for the photo. Leave empty when the name is written next to the avatar */
  alt?: string
  size?: 'small' | 'large'
}

/**
 * Round photo; the first letter of the name when there is no photo or it does not load
 */
function Avatar({ name, url, alt = '', size = 'small' }: AvatarProps) {
  // Remember which URL failed, so a new URL (new avatar) is tried again
  const [failedUrl, setFailedUrl] = useState('')
  const className = `${styles.avatar} ${styles[size]}`

  if (url && url !== failedUrl) {
    return <img src={url} alt={alt} className={className} onError={() => setFailedUrl(url)} />
  }
  return (
    <span className={className} aria-hidden="true">
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

export default Avatar
