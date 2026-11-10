import { useSearchParams } from 'react-router-dom'
import SearchForm from '../components/SearchForm'
import VenueResults from '../components/VenueResults'
import styles from './HomePage.module.css'

function HomePage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Find your next stay.</h1>
      <SearchForm key={`search-${searchParams}`} />
      <VenueResults key={`results-${query}`} query={query} />
    </div>
  )
}

export default HomePage
