import type { ApiErrorResponse } from '../types/api'

export const API_BASE = 'https://v2.api.noroff.dev'
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY
const TIMEOUT_MS = 10_000

/** Error with a clear message and the HTTP status (0 = no answer) */
export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  token?: string
  signal?: AbortSignal
}

/**
 * Calls the Noroff API and returns the parsed JSON
 * Adds the API key and the access token, stops after 10 s and
 * throws ApiError with the first message from the API
 *
 * @example apiFetch<ApiListResponse<Venue>>('/holidaze/venues?limit=12')
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { method = 'GET', body, token, signal } = options

  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`
  if (API_KEY) headers['X-Noroff-API-Key'] = API_KEY

  const timeout = AbortSignal.timeout(TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new ApiError('The server is taking too long. Please try again.', 0)
    }
    throw new ApiError('Could not reach the server. Check your connection.', 0)
  }

  if (response.status === 204) return undefined as T

  const json: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      (json as ApiErrorResponse | null)?.errors?.[0]?.message ??
      `Something went wrong (${response.status}).`
    throw new ApiError(message, response.status)
  }

  return json as T
}
