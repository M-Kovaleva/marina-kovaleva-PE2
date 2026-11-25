import { useContext } from 'react'
import { ToastContext } from '../context/ToastContext'

/**
 * Shows a short success message at the bottom of the screen
 * @example const { showToast } = useToast()
 */
export function useToast() {
  const toast = useContext(ToastContext)
  if (!toast) throw new Error('useToast must be used inside ToastProvider')
  return toast
}