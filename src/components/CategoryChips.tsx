import { useSearchParams } from 'react-router-dom'
import styles from './CategoryChips.module.css'

const CATEGORIES = ['Apartment', 'Hotel', 'Cabin', 'Villa', 'Room']

/**
 * Quick search by venue type
 * A click runs the same search with that word (dates and guests stay) 
 * A click on the selected chip clears the search word
 */
function CategoryChips() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim().toLowerCase() ?? ''

  function handleClick(word: string) {
    const params = new URLSearchParams(searchParams)
    if (query === word) params.delete('q')
    else params.set('q', word)
    setSearchParams(params)
  }

  return (
    <ul className={styles.chips} aria-label="Venue types">
      {CATEGORIES.map((category) => {
        const word = category.toLowerCase()
        return (
          <li key={category}>
            <button
              type="button"
              className={styles.chip}
              aria-pressed={query === word}
              onClick={() => handleClick(word)}
            >
              {category}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default CategoryChips