import LoginForm from './LoginForm'
import Modal from './Modal'
import { useAuth } from '../hooks/useAuth'

/**
 * The one login modal of the app. Opened with openAuth('login') from anywhere,
 * on top of the current page, so search dates and guests are not lost
 */
function AuthModal() {
  const { authView, closeAuth } = useAuth()

  return (
    <Modal
      isOpen={authView === 'login'}
      onClose={closeAuth}
      title="Welcome back"
      description="Log in to book stays or manage your venues."
    >
      <LoginForm />
    </Modal>
  )
}

export default AuthModal