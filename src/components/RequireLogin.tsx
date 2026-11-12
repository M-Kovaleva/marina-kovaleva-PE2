import { useEffect, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface RequireLoginProps {
  children: ReactNode
}

/**
 * Shows the page only to logged-in users.
 * Visitors go to the home page with the login modal open
 */
function RequireLogin({ children }: RequireLoginProps) {
  const { user, openAuth } = useAuth()

  useEffect(() => {
    if (!user) openAuth('login')
  }, [user, openAuth])

  if (!user) return <Navigate to="/" replace />
  return children
}

export default RequireLogin
