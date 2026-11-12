import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AtSign, Eye, EyeOff, House, Lock, Mail, Search, TriangleAlert } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { registerUser } from '../services/auth'
import buttons from '../styles/buttons.module.css'
import forms from '../styles/forms.module.css'
import styles from './RegisterForm.module.css'

const NAME_PATTERN = /^[A-Za-z0-9_]+$/
const EMAIL_PATTERN = /^[^\s@]+@stud\.noroff\.no$/i
const MIN_PASSWORD = 8

interface RegisterErrors {
  name?: string
  email?: string
  password?: string
}

function validate(name: string, email: string, password: string): RegisterErrors {
  const errors: RegisterErrors = {}
  if (!name) errors.name = 'Choose a username'
  else if (!NAME_PATTERN.test(name)) errors.name = 'Only letters, numbers and _ (no spaces)'
  if (!EMAIL_PATTERN.test(email)) errors.email = 'Use your @stud.noroff.no email'
  if (password.length < MIN_PASSWORD) errors.password = `At least ${MIN_PASSWORD} characters`
  return errors
}

interface RegisterFormProps {
  /** Start with "Venue manager" selected */
  asManager: boolean
}

/**
 * Account type + username, email, password
 * The API does not return a token on register, so we log in right after
 * and open the profile page
 */
function RegisterForm({ asManager }: RegisterFormProps) {
  const { login, closeAuth } = useAuth()
  const navigate = useNavigate()
  const [venueManager, setVenueManager] = useState(asManager)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [apiError, setApiError] = useState('')
  const [isSending, setIsSending] = useState(false)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanName = name.trim()
    const cleanEmail = email.trim()
    const found = validate(cleanName, cleanEmail, password)
    setErrors(found)
    setApiError('')
    if (Object.keys(found).length > 0) return

    setIsSending(true)
    try {
      await registerUser({ name: cleanName, email: cleanEmail, password, venueManager })
      await login({ email: cleanEmail, password })
      closeAuth()
      navigate('/profile')
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Something went wrong.')
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

      <fieldset className={styles.types}>
        <legend className={forms.label}>Account type</legend>
        <label className={styles.type}>
          <input
            type="radio"
            name="account-type"
            checked={!venueManager}
            onChange={() => setVenueManager(false)}
          />
          <Search size={20} aria-hidden="true" />
          <span className={styles.typeTitle}>Book stays</span>
          <span className={styles.typeRole}>Customer</span>
        </label>
        <label className={styles.type}>
          <input
            type="radio"
            name="account-type"
            checked={venueManager}
            onChange={() => setVenueManager(true)}
          />
          <House size={20} aria-hidden="true" />
          <span className={styles.typeTitle}>List venues</span>
          <span className={styles.typeRole}>Venue manager</span>
        </label>
      </fieldset>

      <div className={forms.field}>
        <label htmlFor="register-name" className={forms.label}>
          Username
        </label>
        <div className={forms.inputWrap}>
          <AtSign size={20} aria-hidden="true" />
          <input
            id="register-name"
            className={forms.input}
            autoComplete="username"
            placeholder="e.g. anna_k"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby="register-name-note"
          />
        </div>
        <p id="register-name-note" className={errors.name ? forms.error : forms.hint}>
          {errors.name ?? 'Letters, numbers and _ only'}
        </p>
      </div>

      <div className={forms.field}>
        <label htmlFor="register-email" className={forms.label}>
          Email
        </label>
        <div className={forms.inputWrap}>
          <Mail size={20} aria-hidden="true" />
          <input
            id="register-email"
            className={forms.input}
            type="email"
            autoComplete="email"
            placeholder="name@stud.noroff.no"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby="register-email-note"
          />
        </div>
        <p id="register-email-note" className={errors.email ? forms.error : forms.hint}>
          {errors.email ?? 'Use your @stud.noroff.no email'}
        </p>
      </div>

      <div className={forms.field}>
        <label htmlFor="register-password" className={forms.label}>
          Password
        </label>
        <div className={forms.inputWrap}>
          <Lock size={20} aria-hidden="true" />
          <input
            id="register-password"
            className={`${forms.input} ${forms.withButton}`}
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder={`At least ${MIN_PASSWORD} characters`}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'register-password-error' : undefined}
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
          <p id="register-password-error" className={forms.error}>
            {errors.password}
          </p>
        )}
      </div>

      <button type="submit" className={`${buttons.primary} ${forms.submit}`} disabled={isSending}>
        {isSending ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}

export default RegisterForm