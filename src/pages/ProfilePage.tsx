import ProfileCard from '../components/ProfileCard'
import { useAuth } from '../hooks/useAuth'
import styles from './ProfilePage.module.css'

/** Only for logged-in users (RequireLogin in App) */
function ProfilePage() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className={styles.page}>
      <title>{`${user.name} · Holidaze`}</title>
      <ProfileCard user={user} />
      <div className={styles.content}>{/* Bookings and venues come in the next steps */}</div>
    </div>
  )
}

export default ProfilePage
