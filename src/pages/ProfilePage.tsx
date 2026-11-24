import { useState } from 'react'
import AvatarForm from '../components/AvatarForm'
import Modal from '../components/Modal'
import MyBookings from '../components/MyBookings'
import MyVenues from '../components/MyVenues'
import ProfileCard from '../components/ProfileCard'
import { useAuth } from '../hooks/useAuth'
import styles from './ProfilePage.module.css'

/** Only for logged-in users (RequireLogin in App) */
function ProfilePage() {
  const { user } = useAuth()
  const [isAvatarOpen, setIsAvatarOpen] = useState(false)
  if (!user) return null

  return (
    <div className={styles.page}>
      <title>{`${user.name} | Holidaze`}</title>
      <ProfileCard user={user} onChangeAvatar={() => setIsAvatarOpen(true)} />
      <div className={styles.content}>
        {/* Venue managers cannot book stays, so they see their venues instead */}
        {user.venueManager ? (
          <MyVenues name={user.name} token={user.accessToken} />
        ) : (
          <MyBookings name={user.name} token={user.accessToken} />
        )}
      </div>

      <Modal isOpen={isAvatarOpen} onClose={() => setIsAvatarOpen(false)} title="Change avatar">
        <AvatarForm onDone={() => setIsAvatarOpen(false)} />
      </Modal>
    </div>
  )
}

export default ProfilePage
