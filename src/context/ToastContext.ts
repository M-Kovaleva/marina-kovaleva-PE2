import { createContext } from 'react'

/** One short success message, e.g. "Venue deleted" */
export interface ToastMessage {
  /** New for every showToast, so the same text shown twice starts its timer again */
  id: number
  text: string
}

export interface ToastContextValue {
  /** The message on the screen, or null when there is none */
  toast: ToastMessage | null
  showToast: (text: string) => void
  closeToast: () => void
}

/** Filled by ToastProvider. Read it with useToast() */
export const ToastContext = createContext<ToastContextValue | null>(null)
