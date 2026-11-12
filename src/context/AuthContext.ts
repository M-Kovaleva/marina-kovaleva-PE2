import { createContext } from 'react'
import type { LoginData } from '../services/auth'
import type { Media } from '../types/venue'

/** What we keep about the logged-in user (never the password) */
export interface User {
  name: string
  email: string
  avatar?: Media
  venueManager: boolean
  accessToken: string
}

/** Which form the auth modal shows */
export type AuthView = 'login'

export interface AuthContextValue {
  user: User | null
  isManager: boolean
  login: (data: LoginData) => Promise<void>
  logout: () => void
  /** The open auth modal, or null when it is closed */
  authView: AuthView | null
  openAuth: (view: AuthView) => void
  closeAuth: () => void
}

/** Filled by AuthProvider. Read it with useAuth() */
export const AuthContext = createContext<AuthContextValue | null>(null)
