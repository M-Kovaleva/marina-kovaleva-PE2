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

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})

/** Date as "Fri 20 Nov" */
export function formatDate(date: Date): string {
  return dateFormat.format(date)
}

const rangeFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/** Two dates as "14 – 17 Nov 2026" or "28 Dec 2026 – 2 Jan 2027" */
export function formatDateRange(from: Date, to: Date): string {
  return rangeFormat.formatRange(from, to)
}
