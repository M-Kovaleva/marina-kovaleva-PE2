import { apiFetch } from './apiFetch'
import type { ApiResponse } from '../types/api'
import type { Booking } from '../types/booking'

/** What the booking form sends. Dates are ISO strings */
export interface BookingData {
  dateFrom: string
  dateTo: string
  guests: number
  venueId: string
}

/**
 * Creates a booking. Customers only
 */
export async function createBooking(data: BookingData, token: string): Promise<Booking> {
  const res = await apiFetch<ApiResponse<Booking>>('/holidaze/bookings', {
    method: 'POST',
    body: data,
    token,
  })
  return res.data
}
