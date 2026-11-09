import styles from './Loader.module.css'

interface LoaderProps {
  label?: string
}

/**
 * Spinner with a text. Screen readers announce the text (role="status")
 */
function Loader({ label = 'Loading…' }: LoaderProps) {
  return (
    <div className={styles.loader} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

export default Loader
