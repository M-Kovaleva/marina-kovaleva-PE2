/**
 * Text to show for a caught error: the message of ApiError (or any Error),
 * or a general text when something else was thrown
 */
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.'
}
