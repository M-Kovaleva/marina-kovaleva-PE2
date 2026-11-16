import MyBookings from '../components/MyBookings'
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
      <div className={styles.content}>
        {/* Customers book stays; venue managers cannot book (their venues come in Sprint 5) */}
        {!user.venueManager && <MyBookings name={user.name} token={user.accessToken} />}
      </div>
    </div>
  )
}

export default ProfilePage
