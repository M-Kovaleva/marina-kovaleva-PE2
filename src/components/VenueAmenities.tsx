import { Check, Coffee, PawPrint, SquareParking, Wifi, X, type LucideIcon } from 'lucide-react'
import type { VenueMeta } from '../types/venue'
import { AMENITIES } from '../constants'
import styles from './VenueAmenities.module.css'

/** Icon and "yes / no" text for each amenity */
const DETAILS: Record<keyof VenueMeta, { icon: LucideIcon; yes: string; no: string }> = {
  wifi: { icon: Wifi, yes: 'Included', no: 'Not included' },
  parking: { icon: SquareParking, yes: 'Included', no: 'Not included' },
  breakfast: { icon: Coffee, yes: 'Included', no: 'Not included' },
  pets: { icon: PawPrint, yes: 'Allowed', no: 'Not allowed' },
}

interface VenueAmenitiesProps {
  meta: VenueMeta
}

/**
 * All four amenities with "Included" / "Not included", so guests also see what is missing
 */
function VenueAmenities({ meta }: VenueAmenitiesProps) {
  return (
    <ul className={styles.list}>
      {AMENITIES.map(({ key, label }) => {
        const { icon: Icon, yes, no } = DETAILS[key]
        const has = meta[key]
        return (
          <li key={key} className={has ? styles.item : `${styles.item} ${styles.missing}`}>
            <Icon size={24} aria-hidden="true" className={styles.icon} />
            <div>
              <p className={styles.label}>{label}</p>
              <p className={styles.status}>
                {has ? <Check size={14} aria-hidden="true" /> : <X size={14} aria-hidden="true" />}
                {has ? yes : no}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default VenueAmenities
