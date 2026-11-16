import { useEffect, useState } from 'react'
import { getProfileBookings } from '../services/profiles'
import type { Booking } from '../types/booking'

interface BookingsState {
  bookings: Booking[]
  error: string | null
  /** Which request this result belongs to ("name-attempt") */
  requestKey: string
}

/**
 * Loads the bookings of the logged-in customer, with the venue of each booking
 * `retry` repeats a failed request
 */
export function useMyBookings(name: string, token: string) {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<BookingsState>({ bookings: [], error: null, requestKey: '' })
  const requestKey = `${name}-${attempt}`

  useEffect(() => {
    const controller = new AbortController()

    getProfileBookings(name, token, controller.signal)
      .then((bookings) => setState({ bookings, error: null, requestKey }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message = error instanceof Error ? error.message : 'Something went wrong.'
        setState({ bookings: [], error: message, requestKey })
      })

    return () => controller.abort()
  }, [name, token, requestKey])

  // Still loading while the saved result belongs to an older request
  const isLoading = state.requestKey !== requestKey

  function retry() {
    setAttempt((a) => a + 1)
  }

  return { bookings: state.bookings, isLoading, error: state.error, retry }
}
