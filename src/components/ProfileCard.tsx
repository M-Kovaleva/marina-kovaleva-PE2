import { ImageIcon, Mail } from 'lucide-react'
import Avatar from './Avatar'
import type { User } from '../context/AuthContext'
import buttons from '../styles/buttons.module.css'
import styles from './ProfileCard.module.css'

interface ProfileCardProps {
  user: User
  onChangeAvatar: () => void
}

/** Avatar, name, email and role of the logged-in user */
function ProfileCard({ user, onChangeAvatar }: ProfileCardProps) {
  return (
    <section className={styles.card} aria-labelledby="profile-name">
      <Avatar
        name={user.name}
        url={user.avatar?.url}
        alt={user.avatar?.alt || `${user.name}’s avatar`}
        size="large"
      />
      <h1 id="profile-name" className={styles.name}>
        {user.name}
      </h1>
      <p className={styles.email}>
        <Mail size={16} aria-hidden="true" />
        {user.email}
      </p>
      <p className={styles.role}>{user.venueManager ? 'Venue manager' : 'Customer'}</p>
      <button
        type="button"
        className={`${buttons.secondary} ${styles.change}`}
        onClick={onChangeAvatar}
      >
        <ImageIcon size={18} aria-hidden="true" />
        Change avatar
      </button>
    </section>
  )
}

export default ProfileCard
