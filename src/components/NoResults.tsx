import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import buttons from '../styles/buttons.module.css'
import styles from './NoResults.module.css'

interface NoResultsProps {
  title: string
  message: string
}

/** Puts the cursor in the "Where" field of the search form (the browser scrolls to it) 
 * 
*/
function focusSearch() {
  document.getElementById('search-where')?.focus()
}

/**
 * Empty state for the venue list: a message, "Change search" and "Show all venues"
 * */
function NoResults({ title, message }: NoResultsProps) {
  return (
    <div className={styles.box} role="status">
      <SearchX size={32} aria-hidden="true" className={styles.icon} />
      <p className={styles.title}>{title}</p>
      <p>{message}</p>

      <div className={styles.actions}>
        <button type="button" className={buttons.primary} onClick={focusSearch}>
          Change search
        </button>
        <Link to="/" className={buttons.secondary}>
          Show all venues
        </Link>
      </div>
    </div>
  )
}

export default NoResults