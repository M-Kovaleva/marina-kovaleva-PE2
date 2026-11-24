import { TriangleAlert } from 'lucide-react'
import forms from '../styles/forms.module.css'

interface FormAlertProps {
  /** Nothing is shown while the message is empty */
  message: string
}

/**
 * Red message at the top of a form or modal (e.g. an error from the API)
 * role="alert": screen readers read it out as soon as it appears
 */
function FormAlert({ message }: FormAlertProps) {
  if (!message) return null
  return (
    <p className={forms.alert} role="alert">
      <TriangleAlert size={18} aria-hidden="true" />
      {message}
    </p>
  )
}

export default FormAlert
