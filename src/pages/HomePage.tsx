import { useSearchParams } from 'react-router-dom'
import VenueResults from '../components/VenueResults'
import styles from './HomePage.module.css'

function HomePage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Find your next stay.</h1>
      <VenueResults key={query} query={query} />
    </div>
  )
}

export default HomePage
