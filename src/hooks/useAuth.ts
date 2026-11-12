import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/**
 * The logged-in user, isManager, login and logout
 * @example const { user, isManager, logout } = useAuth()
 */
export function useAuth() {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error('useAuth must be used inside AuthProvider')
  return auth
}
