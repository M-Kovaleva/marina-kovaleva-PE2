import { apiFetch } from './apiFetch'
import type { ApiResponse } from '../types/api'
import type { Profile } from '../types/profile'

export interface RegisterData {
  name: string
  email: string
  password: string
  venueManager: boolean
}

export interface LoginData {
  email: string
  password: string
}

/** The logged-in user: profile fields + the access token */
export type AuthUser = Profile & { accessToken: string }

/**
 * Registers a new Customer or Venue manager
 * The API does not return a token here, so log in right after
 */
export async function registerUser(data: RegisterData): Promise<Profile> {
  const res = await apiFetch<ApiResponse<Profile>>('/auth/register', { method: 'POST', body: data })
  return res.data
}

/**
 * Logs a user in `_holidaze=true` adds `venueManager` to the answer
 */
export async function loginUser(data: LoginData): Promise<AuthUser> {
  const res = await apiFetch<ApiResponse<AuthUser>>('/auth/login?_holidaze=true', {
    method: 'POST',
    body: data,
  })
  return res.data
}
