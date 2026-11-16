/**
 * Date as "YYYY-MM-DD" in local time — the value format of <input type="date">
 */
export function toDateInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** "YYYY-MM-DD" → Date at local midnight, or undefined when the text is not a real date */
export function fromDateInputValue(value: string | null): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return toDateInputValue(date) === value ? date : undefined
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

/** Today at local midnight */
export function startOfToday(): Date {
  return addDays(new Date(), 0)
}

/** Number of nights between check-in and check-out */
export function countNights(from: Date, to: Date): number {
  // Math.round: a day with a clock change (summer time) is 23 or 25 hours long
  return Math.round((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000))
}