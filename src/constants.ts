import type { VenueMeta } from './types/venue'

/** Most guests one venue can have (the API limit) */
export const MAX_GUESTS = 100

/** Longest alt text for a photo or an avatar */
export const MAX_ALT = 120

/** The four amenities of a venue, in the order we show them */
export const AMENITIES: { key: keyof VenueMeta; label: string }[] = [
  { key: 'wifi', label: 'Wi-Fi' },
  { key: 'parking', label: 'Parking' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'pets', label: 'Pets' },
]
