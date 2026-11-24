import { useEffect, useState } from 'react'
import { getProfileVenues } from '../services/profiles'
import type { Venue } from '../types/venue'
import { getErrorMessage } from '../utils/errors'

interface VenuesState {
  venues: Venue[]
  error: string | null
  /** Which request this result belongs to ("name-attempt") */
  requestKey: string
}

/**
 * Loads the venues of the logged-in venue manager, with their bookings
 * `reload` loads them again (after an error, or after a venue is created, edited or deleted)
 */
export function useMyVenues(name: string, token: string) {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<VenuesState>({ venues: [], error: null, requestKey: '' })
  const requestKey = `${name}-${attempt}`

  useEffect(() => {
    const controller = new AbortController()

    getProfileVenues(name, token, controller.signal)
      .then((venues) => setState({ venues, error: null, requestKey }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message = getErrorMessage(error)
        setState({ venues: [], error: message, requestKey })
      })

    return () => controller.abort()
  }, [name, token, requestKey])

  // Still loading while the saved result belongs to an older request
  const isLoading = state.requestKey !== requestKey

  function reload() {
    setAttempt((a) => a + 1)
  }

  return { venues: state.venues, isLoading, error: state.error, reload }
}
