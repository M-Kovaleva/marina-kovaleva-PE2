import type { Location } from '../types/venue'

const priceFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

/** Price as "$145" */
export function formatPrice(price: number): string {
  return priceFormat.format(price)
}

/** "City, Country", or an empty string when the owner left both empty */
export function formatPlace(location: Location): string {
  return [location.city, location.country].filter(Boolean).join(', ')
}
