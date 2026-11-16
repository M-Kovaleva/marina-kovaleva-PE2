import { Mail } from 'lucide-react'
import Avatar from './Avatar'
import type { User } from '../context/AuthContext'
import styles from './ProfileCard.module.css'

interface ProfileCardProps {
  user: User
}

/** Avatar, name, email and role of the logged-in user */
function ProfileCard({ user }: ProfileCardProps) {
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
    </section>
  )
}

export default ProfileCard
