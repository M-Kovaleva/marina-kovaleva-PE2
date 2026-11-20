import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface RequireLoginProps {
  children: ReactNode
}

/**
 * Shows the page only to logged-in users
 * Visitors go to the home page with the login modal open
 */
function RequireLogin({ children }: RequireLoginProps) {
  const { user, openAuth } = useAuth()
  // Was the visitor logged out when the page opened? After "Log out" on this page
  // we only leave it, without opening the login modal
  const [cameLoggedOut] = useState(user === null)

  useEffect(() => {
    if (cameLoggedOut) openAuth('login')
  }, [cameLoggedOut, openAuth])

  if (!user) return <Navigate to="/" replace />
  return children
}

export default RequireLogin
