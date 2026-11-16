import { useState } from 'react'
import styles from './Avatar.module.css'

/** The gradient picture Noroff gives every new user who did not choose an avatar */
const NOROFF_DEFAULT_AVATAR = 'photo-1579547945413-497e1b99dac0'

interface AvatarProps {
  name: string
  url?: string
  /** Alt text for the photo. Leave empty when the name is written next to the avatar */
  alt?: string
  size?: 'small' | 'large'
}

/**
 * Round photo; the first letter of the name when there is no photo,
 * it is the Noroff default picture, or it does not load
 */
function Avatar({ name, url, alt = '', size = 'small' }: AvatarProps) {
  // Remember which URL failed, so a new URL (new avatar) is tried again
  const [failedUrl, setFailedUrl] = useState('')
  const className = `${styles.avatar} ${styles[size]}`

  const hasPhoto = url && !url.includes(NOROFF_DEFAULT_AVATAR) && url !== failedUrl

  if (hasPhoto) {
    return <img src={url} alt={alt} className={className} onError={() => setFailedUrl(url)} />
  }
  return (
    <span className={className} aria-hidden="true">
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

export default Avatar
