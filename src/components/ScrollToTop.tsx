import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * React Router keeps the scroll position when the page changes,
 * so a new page could open in the middle. This opens every new page at the top.
 * Not for Back / Forward (POP): the browser restores the position itself.
 * Not for an address with #: that page scrolls to its own section (e.g. MyBookings)
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType === 'POP' || hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash, navigationType])

  return null
}

export default ScrollToTop
