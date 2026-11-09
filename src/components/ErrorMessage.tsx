import { Link } from 'react-router-dom'
import { TriangleAlert } from 'lucide-react'
import buttons from '../styles/buttons.module.css'
import styles from './ErrorMessage.module.css'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  backTo?: { to: string; label: string }
}

/**
 * Error box with an optional "Try again" button and a link back
 */
function ErrorMessage({ message, onRetry, backTo }: ErrorMessageProps) {
  return (
    <div className={styles.error} role="alert">
      <TriangleAlert size={32} aria-hidden="true" className={styles.icon} />
      <p className={styles.title}>Something went wrong</p>
      <p>{message}</p>

      {(onRetry || backTo) && (
        <div className={styles.actions}>
          {onRetry && (
            <button type="button" className={buttons.primary} onClick={onRetry}>
              Try again
            </button>
          )}
          {backTo && (
            <Link to={backTo.to} className={buttons.secondary}>
              {backTo.label}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default ErrorMessage
