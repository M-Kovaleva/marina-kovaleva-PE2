import LoginForm from './LoginForm'
import Modal from './Modal'
import RegisterForm from './RegisterForm'
import { useAuth } from '../hooks/useAuth'
import styles from './AuthModal.module.css'

/**
 * The one login / register modal of the app. Opened with openAuth(...) from anywhere,
 * on top of the current page, so search dates and guests are not lost
 */
function AuthModal() {
  const { authView, openAuth, closeAuth } = useAuth()
  const isLogin = authView === 'login'

  return (
    <Modal
      isOpen={authView !== null}
      onClose={closeAuth}
      title={isLogin ? 'Welcome back' : 'Create your account'}
      description={
        isLogin
          ? 'Log in to book stays or manage your venues.'
          : 'It’s free. Use your stud.noroff.no email.'
      }
    >
      <div className={styles.tabs}>
        <button
          type="button"
          className={styles.tab}
          aria-pressed={isLogin}
          onClick={() => openAuth('login')}
        >
          Log in
        </button>
        <button
          type="button"
          className={styles.tab}
          aria-pressed={!isLogin}
          onClick={() => openAuth('register')}
        >
          Register
        </button>
      </div>

      {isLogin ? <LoginForm /> : <RegisterForm asManager={authView === 'register-manager'} />}

      <p className={styles.switch}>
        {isLogin ? 'No account yet?' : 'Already have an account?'}{' '}
        <button
          type="button"
          className={styles.switchButton}
          onClick={() => openAuth(isLogin ? 'register' : 'login')}
        >
          {isLogin ? 'Register' : 'Log in'}
        </button>
      </p>
    </Modal>
  )
}

export default AuthModal