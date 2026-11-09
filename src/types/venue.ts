import type { Booking } from './booking'
import type { Profile } from './profile'

/** An image with alt text (venue photos, avatar, banner) */
export interface Media {
  url: string
  alt: string
}

/** Amenities of a venue */
export interface VenueMeta {
  wifi: boolean
  parking: boolean
  breakfast: boolean
  pets: boolean
}

/** Address of a venue. Text fields are `null` when the owner left them empty */
export interface Location {
  address: string | null
  city: string | null
  zip: string | null
  country: string | null
  continent: string | null
  lat: number
  lng: number
}

/**
 * A venue from `/holidaze/venues`
 * `owner` comes only with `?_owner=true`, `bookings` only with `?_bookings=true`
 */
export interface Venue {
  id: string
  name: string
  description: string
  media: Media[]
  price: number
  maxGuests: number
  rating: number
  created: string
  updated: string
  meta: VenueMeta
  location: Location
  owner?: Profile
  bookings?: Booking[]
}
