import { useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import { useVenue } from '../hooks/useVenue'
import styles from './VenuePage.module.css'

function VenuePage() {
  const { id = '' } = useParams()
  const { venue, isLoading, error, retry } = useVenue(id)

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Loader label="Loading venue…" />
      </div>
    )
  }

  if (error || !venue) {
    return (
      <div className={styles.page}>
        <ErrorMessage
          message={error ?? 'Venue not found.'}
          onRetry={retry}
          backTo={{ to: '/', label: 'Back to all venues' }}
        />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <title>{`${venue.name} · Holidaze`}</title>
      <h1 className={styles.title}>{venue.name}</h1>
    </div>
  )
}

export default VenuePage
