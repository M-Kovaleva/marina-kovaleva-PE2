import { useState, type ReactNode } from 'react'
import { ToastContext, type ToastMessage } from './ToastContext'

interface ToastProviderProps {
  children: ReactNode
}

/**
 * Keeps the toast message for the whole app, so it stays on the screen
 * when the page changes (e.g. the venue page goes to the profile after a delete)
 */
function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastMessage | null>(null)

  function showToast(text: string) {
    setToast({ id: Date.now(), text })
  }

  function closeToast() {
    setToast(null)
  }

  return (
    <ToastContext.Provider value={{ toast, showToast, closeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export default ToastProvider