import { useState, type SubmitEvent } from 'react'
import { Eye, EyeOff, Lock, Mail, TriangleAlert } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { ApiError } from '../services/apiFetch'
import buttons from '../styles/buttons.module.css'
import forms from '../styles/forms.module.css'

interface LoginErrors {
  email?: string
  password?: string
}

function validate(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {}
  if (!email.trim()) errors.email = 'Enter your email'
  if (!password) errors.password = 'Enter your password'
  return errors
}

/**
 * Email + password. On success the modal closes; a wrong email or password
 * shows a message above the fields
 */
function LoginForm() {
  const { login, closeAuth } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})
  const [apiError, setApiError] = useState('')
  const [isSending, setIsSending] = useState(false)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(email, password)
    setErrors(found)
    setApiError('')
    if (Object.keys(found).length > 0) return

    setIsSending(true)
    try {
      await login({ email: email.trim(), password })
      closeAuth()
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setApiError('Wrong email or password. Please try again.')
      } else {
        setApiError(error instanceof Error ? error.message : 'Something went wrong.')
      }
      setIsSending(false)
    }
  }

  return (
    <form className={forms.form} noValidate onSubmit={handleSubmit}>
      {apiError && (
        <p className={forms.alert} role="alert">
          <TriangleAlert size={18} aria-hidden="true" />
          {apiError}
        </p>
      )}

      <div className={forms.field}>
        <label htmlFor="login-email" className={forms.label}>
          Email
        </label>
        <div className={forms.inputWrap}>
          <Mail size={20} aria-hidden="true" />
          <input
            id="login-email"
            className={forms.input}
            type="email"
            autoComplete="email"
            placeholder="name@stud.noroff.no"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
          />
        </div>
        {errors.email && (
          <p id="login-email-error" className={forms.error}>
            {errors.email}
          </p>
        )}
      </div>

      <div className={forms.field}>
        <label htmlFor="login-password" className={forms.label}>
          Password
        </label>
        <div className={forms.inputWrap}>
          <Lock size={20} aria-hidden="true" />
          <input
            id="login-password"
            className={`${forms.input} ${forms.withButton}`}
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
          />
          <button
            type="button"
            className={forms.inputButton}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} aria-hidden="true" />
            ) : (
              <Eye size={20} aria-hidden="true" />
            )}
          </button>
        </div>
        {errors.password && (
          <p id="login-password-error" className={forms.error}>
            {errors.password}
          </p>
        )}
      </div>

      <button type="submit" className={`${buttons.primary} ${forms.submit}`} disabled={isSending}>
        {isSending ? 'Logging in…' : 'Log in'}
      </button>
    </form>
  )
}

export default LoginForm