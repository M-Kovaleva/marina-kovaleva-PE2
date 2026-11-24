import { useState, type SubmitEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import Avatar from './Avatar'
import { useAuth } from '../hooks/useAuth'
import { ApiError } from '../services/apiFetch'
import { updateAvatar } from '../services/profiles'
import { isHttpsUrl } from '../utils/url'
import buttons from '../styles/buttons.module.css'
import forms from '../styles/forms.module.css'
import styles from './AvatarForm.module.css'
import { getErrorMessage } from '../utils/errors'
import FormAlert from './FormAlert'

const MAX_ALT = 120

interface AvatarFormProps {
  onDone: () => void
}

/**
 * Image URL + alt text with a live preview. Saves only the avatar (PUT profile)
 * and updates it in AuthContext, so the header and the profile change at once
 */
function AvatarForm({ onDone }: AvatarFormProps) {
  const { user, updateUser } = useAuth()
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [urlError, setUrlError] = useState('')
  const [apiError, setApiError] = useState('')
  const [isSending, setIsSending] = useState(false)

  if (!user) return null
  const cleanUrl = url.trim()

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return
    setApiError('')
    if (!isHttpsUrl(cleanUrl)) {
      setUrlError('Use a public image link that starts with https://')
      return
    }

    setIsSending(true)
    try {
      const avatar = { url: cleanUrl, alt: alt.trim() }
      const profile = await updateAvatar(user.name, avatar, user.accessToken)
      updateUser({ avatar: profile.avatar ?? avatar })
      onDone()
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        setUrlError('This image is not public. Use a link anyone can open.')
      } else {
        setApiError(getErrorMessage(error))
      }
      setIsSending(false)
    }
  }

  return (
    <form className={forms.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.preview}>
        <Avatar name={user.name} url={user.avatar?.url} size="medium" />
        <ArrowRight size={20} aria-hidden="true" />
        <Avatar
          name={user.name}
          url={isHttpsUrl(cleanUrl) ? cleanUrl : undefined}
          alt="Preview of the new avatar"
          size="medium"
        />
        <p className={styles.previewText}>
          <strong>Preview</strong>
          <span>Updates while you type</span>
        </p>
      </div>

      <FormAlert message={apiError} />

      <div className={forms.field}>
        <label htmlFor="avatar-url" className={forms.label}>
          Image URL
        </label>
        <input
          id="avatar-url"
          className={`${forms.input} ${styles.input}`}
          type="url"
          inputMode="url"
          placeholder="https://images.example.com/my-photo.jpg"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value)
            setUrlError('')
          }}
          aria-invalid={Boolean(urlError)}
          aria-describedby="avatar-url-note"
        />
        <p id="avatar-url-note" className={urlError ? forms.error : forms.hint}>
          {urlError || 'Use a public image link that starts with https://'}
        </p>
      </div>

      <div className={forms.field}>
        <label htmlFor="avatar-alt" className={forms.label}>
          Alt text (optional)
        </label>
        <input
          id="avatar-alt"
          className={`${forms.input} ${styles.input}`}
          maxLength={MAX_ALT}
          placeholder="View from my window"
          value={alt}
          onChange={(event) => setAlt(event.target.value)}
          aria-describedby="avatar-alt-note"
        />
        <p id="avatar-alt-note" className={forms.hint}>
          Max {MAX_ALT} characters
        </p>
      </div>

      <div className={styles.actions}>
        <button type="button" className={buttons.secondary} onClick={onDone}>
          Cancel
        </button>
        <button type="submit" className={buttons.primary} disabled={isSending}>
          {isSending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default AvatarForm
