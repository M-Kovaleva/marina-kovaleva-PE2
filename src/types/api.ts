/**
 * Pagination info that the Noroff API sends with every list response
 */
export interface PaginationMeta {
  isFirstPage: boolean
  isLastPage: boolean
  currentPage: number
  previousPage: number | null
  nextPage: number | null
  pageCount: number
  totalCount: number
}

/**
 * Shape of every successful API response: `{ data, meta }`
 * For a single item `meta` is an empty object
 *
 * @example ApiResponse<Venue> // GET /holidaze/venues/<id>
 */
export interface ApiResponse<T, M = Record<string, never>> {
  data: T
  meta: M
}

/**
 * A list response with pagination meta
 *
 * @example ApiListResponse<Venue> // GET /holidaze/venues
 */
export type ApiListResponse<T> = ApiResponse<T[], PaginationMeta>

/** One error from the `errors` array */
export interface ApiErrorItem {
  message: string
  code?: string
  path?: string[]
}

/**
 * Body of a failed API response
 *
 * @example { errors: [{ message: 'No venue with such ID' }], status: 'Not Found', statusCode: 404 }
 */
export interface ApiErrorResponse {
  errors: ApiErrorItem[]
  status: string
  statusCode: number
}
