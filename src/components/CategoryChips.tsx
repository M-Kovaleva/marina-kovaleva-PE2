import { useSearchParams } from 'react-router-dom'
import { BedDouble, Building2, Hotel, TreePalm, TreePine, type LucideIcon } from 'lucide-react'
import styles from './CategoryChips.module.css'

/** Venue types with an icon each. The label is also the search word */
const CATEGORIES: { label: string; icon: LucideIcon }[] = [
  { label: 'Apartment', icon: Building2 },
  { label: 'Hotel', icon: Hotel },
  { label: 'Cabin', icon: TreePine },
  { label: 'Villa', icon: TreePalm },
  { label: 'Room', icon: BedDouble },
]

/**
 * Quick search by venue type
 * A click runs the same search with that word (dates and guests stay)
 * A click on the selected type clears the search word
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
      {CATEGORIES.map(({ label, icon: Icon }) => {
        const word = label.toLowerCase()
        return (
          <li key={label}>
            <button
              type="button"
              className={styles.chip}
              aria-pressed={query === word}
              onClick={() => handleClick(word)}
            >
              <Icon size={20} aria-hidden="true" />
              {label}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default CategoryChips
