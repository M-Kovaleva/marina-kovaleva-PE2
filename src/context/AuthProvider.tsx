import { useState, type ReactNode } from 'react'
import { AuthContext, type User } from './AuthContext'
import { loginUser, type LoginData } from '../services/auth'
import { clearUser, loadUser, saveUser } from '../utils/authStorage'

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Keeps the logged-in user for the whole app and in localStorage,
 * so the user stays logged in after a page reload
 */
function AuthProvider({ children }: AuthProviderProps) {
  // loadUser runs only once, on the first render
  const [user, setUser] = useState<User | null>(loadUser)

  /** Logs in and saves only the fields we need. Throws ApiError on a wrong email or password */
  async function login(data: LoginData) {
    const profile = await loginUser(data)
    const loggedIn: User = {
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      venueManager: profile.venueManager ?? false,
      accessToken: profile.accessToken,
    }
    saveUser(loggedIn)
    setUser(loggedIn)
  }

  function logout() {
    clearUser()
    setUser(null)
  }

  const isManager = user?.venueManager === true

  return <AuthContext value={{ user, isManager, login, logout }}>{children}</AuthContext>
}

export default AuthProvider
