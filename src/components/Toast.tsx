import { useEffect } from 'react'
import { CircleCheck, X } from 'lucide-react'
import { useToast } from '../hooks/useToast'
import styles from './Toast.module.css'

/** How long a message stays on the screen */
const DURATION_MS = 5000

/**
 * The one toast of the app: a short success message at the bottom of the screen
 * Closes by itself after 5 seconds or with the ✕ button. Errors stay in the forms instead
 */
function Toast() {
  const { toast, closeToast } = useToast()

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(closeToast, DURATION_MS)
    return () => clearTimeout(timer)
  }, [toast, closeToast])

  // role="status" is always on the page, so screen readers read a new message
  // as soon as it appears, without moving the focus
  return (
    <div role="status" className={styles.region}>
      {toast && (
        <div key={toast.id} className={styles.toast}>
          <CircleCheck size={20} aria-hidden="true" className={styles.icon} />
          <p className={styles.text}>{toast.text}</p>
          <button
            type="button"
            className={styles.close}
            aria-label="Close message"
            onClick={closeToast}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}

export default Toast