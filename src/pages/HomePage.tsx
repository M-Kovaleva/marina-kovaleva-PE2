import { useSearchParams } from 'react-router-dom'
import Hero from '../components/Hero'
import SearchForm from '../components/SearchForm'
import VenueResults from '../components/VenueResults'
import styles from './HomePage.module.css'

function HomePage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''
  const filter = {
    from: searchParams.get('from') ?? '',
    to: searchParams.get('to') ?? '',
    guests: Number(searchParams.get('guests')) || 1,
  }

  return (
    <div>
      <Hero>
        <SearchForm key={`search-${searchParams}`} />
      </Hero>
      <div className={styles.page}>
        <VenueResults key={`results-${query}`} query={query} filter={filter} />
      </div>
    </div>
  )
}

export default HomePage
