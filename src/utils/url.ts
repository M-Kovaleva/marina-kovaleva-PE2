/** True for a link like "https://images.example.com/photo.jpg" */
export function isHttpsUrl(text: string): boolean {
  try {
    return new URL(text).protocol === 'https:'
  } catch {
    return false
  }
}