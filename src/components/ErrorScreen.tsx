import { Link } from 'react-router-dom'
import { TriangleAlert } from 'lucide-react'
import buttons from '../styles/buttons.module.css'
import styles from './ErrorScreen.module.css'

interface ErrorScreenProps {
  title: string
  message: string
  link: { to: string; label: string }
}

/**
 * Full-page error (wrong venue ID, unknown URL) with one clear way back
 */
function ErrorScreen({ title, message, link }: ErrorScreenProps) {
  return (
    <div className={styles.screen}>
      <title>{`${title} · Holidaze`}</title>
      <TriangleAlert size={40} aria-hidden="true" className={styles.icon} />
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.message}>{message}</p>
      <Link to={link.to} className={buttons.primary}>
        {link.label}
      </Link>
    </div>
  )
}

export default ErrorScreen