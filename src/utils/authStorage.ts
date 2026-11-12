import type { User } from '../context/AuthContext'

const STORAGE_KEY = 'holidaze-user'

/** Checks that saved data really looks like a user (it can be old, broken or edited by hand) */
function isUser(data: unknown): data is User {
  if (typeof data !== 'object' || data === null) return false
  const user = data as Record<string, unknown>
  return (
    typeof user.name === 'string' &&
    typeof user.email === 'string' &&
    typeof user.accessToken === 'string' &&
    typeof user.venueManager === 'boolean'
  )
}

/**
 * The saved user, or null
 * Missing, broken or blocked storage = logged out, the app still starts
 */
export function loadUser(): User | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    const data: unknown = JSON.parse(saved)
    return isUser(data) ? data : null
  } catch {
    return null
  }
}

export function saveUser(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } catch {
    // Storage is full or blocked: the user stays logged in until the page is reloaded
  }
}

export function clearUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage is blocked: nothing was saved, so there is nothing to clear
  }
}
