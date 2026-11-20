import { useState, type SubmitEvent } from 'react'
import { DollarSign, Plus, Trash2, TriangleAlert, Users } from 'lucide-react'
import VenueImage from './VenueImage'
import { useAuth } from '../hooks/useAuth'
import { createVenue, updateVenue, type VenueData } from '../services/venues'
import { isHttpsUrl } from '../utils/url'
import type { Venue, VenueMeta } from '../types/venue'
import buttons from '../styles/buttons.module.css'
import forms from '../styles/forms.module.css'
import styles from './VenueForm.module.css'

const MAX_GUESTS = 100
const MAX_ALT = 120

const AMENITIES: { key: keyof VenueMeta; label: string }[] = [
  { key: 'wifi', label: 'Wi-Fi' },
  { key: 'parking', label: 'Parking' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'pets', label: 'Pets allowed' },
]

/** One photo row. `id` is only for React keys and errors, it is not sent to the API */
interface PhotoRow {
  id: string
  url: string
  alt: string
}

/** What the user typed. Numbers stay text until the form is sent */
interface VenueValues {
  name: string
  description: string
  price: string
  maxGuests: string
  photos: PhotoRow[]
  meta: VenueMeta
  city: string
  country: string
}

interface VenueErrors {
  name?: string
  description?: string
  price?: string
  maxGuests?: string
  /** Error per photo row, by row id */
  photos?: Record<string, string>
}

function newPhoto(): PhotoRow {
  return { id: crypto.randomUUID(), url: '', alt: '' }
}

/** Start values: empty for a new venue, the current data when editing */
function toFormValues(venue?: Venue): VenueValues {
  if (!venue) {
    return {
      name: '',
      description: '',
      price: '',
      maxGuests: '',
      photos: [newPhoto()],
      meta: { wifi: false, parking: false, breakfast: false, pets: false },
      city: '',
      country: '',
    }
  }
  const photos = venue.media.map((media) => ({ ...media, id: crypto.randomUUID() }))
  return {
    name: venue.name,
    description: venue.description,
    price: String(venue.price),
    maxGuests: String(venue.maxGuests),
    photos: photos.length > 0 ? photos : [newPhoto()],
    meta: { ...venue.meta },
    city: venue.location.city ?? '',
    country: venue.location.country ?? '',
  }
}

function validate(values: VenueValues): VenueErrors {
  const errors: VenueErrors = {}
  if (!values.name.trim()) errors.name = 'Name is required'
  if (!values.description.trim()) errors.description = 'Description is required'
  if (!(Number(values.price) > 0)) errors.price = 'Must be more than 0'

  const guests = Number(values.maxGuests)
  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
    errors.maxGuests = `From 1 to ${MAX_GUESTS}`
  }

  const photoErrors: Record<string, string> = {}
  for (const photo of values.photos) {
    const url = photo.url.trim()
    if (url && !isHttpsUrl(url)) photoErrors[photo.id] = 'Use a link that starts with https://'
  }
  if (Object.keys(photoErrors).length > 0) errors.photos = photoErrors
  return errors
}

/** How many fields have an error (each photo row counts as one) */
function countErrors({ photos, ...fields }: VenueErrors): number {
  return Object.values(fields).filter(Boolean).length + Object.keys(photos ?? {}).length
}

/** Form values → the body the API expects. Empty photo rows are left out */
function toVenueData(values: VenueValues): VenueData {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    price: Number(values.price),
    maxGuests: Number(values.maxGuests),
    media: values.photos
      .filter((photo) => photo.url.trim())
      .map((photo) => ({ url: photo.url.trim(), alt: photo.alt.trim() })),
    meta: values.meta,
    location: { city: values.city.trim(), country: values.country.trim() },
  }
}

interface VenueFormProps {
  /** The venue to edit. Without it the form creates a new venue */
  venue?: Venue
  onSaved: (venue: Venue) => void
  onCancel: () => void
}

/**
 * Create / Edit venue form: basics, photos, amenities and location
 * Checks the fields before sending; errors from the API are shown at the top
 */
function VenueForm({ venue, onSaved, onCancel }: VenueFormProps) {
  const { user } = useAuth()
  const [values, setValues] = useState(() => toFormValues(venue))
  const [errors, setErrors] = useState<VenueErrors>({})
  const [alert, setAlert] = useState('')
  const [isSending, setIsSending] = useState(false)

  /** Changes one value and keeps the rest. The error of that field goes away while typing */
  function change<K extends keyof VenueValues>(key: K, value: VenueValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function changePhoto(id: string, field: 'url' | 'alt', value: string) {
    change(
      'photos',
      values.photos.map((photo) => (photo.id === id ? { ...photo, [field]: value } : photo))
    )
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return
    const found = validate(values)
    const count = countErrors(found)
    setErrors(found)
    if (count > 0) {
      setAlert(count === 1 ? 'Please fix 1 field below.' : `Please fix ${count} fields below.`)
      return
    }

    setAlert('')
    setIsSending(true)
    try {
      const data = toVenueData(values)
      const saved = venue
        ? await updateVenue(venue.id, data, user.accessToken)
        : await createVenue(data, user.accessToken)
      onSaved(saved)
    } catch (error) {
      setAlert(error instanceof Error ? error.message : 'Something went wrong.')
      setIsSending(false)
    }
  }

  let submitLabel = venue ? 'Save changes' : 'Create venue'
  if (isSending) submitLabel = venue ? 'Saving…' : 'Creating…'

  return (
    <form className={forms.form} noValidate onSubmit={handleSubmit}>
      {alert && (
        <p className={forms.alert} role="alert">
          <TriangleAlert size={18} aria-hidden="true" />
          {alert}
        </p>
      )}

      <fieldset className={styles.section}>
        <legend className={styles.legend}>Basics</legend>

        <div className={forms.field}>
          <label htmlFor="venue-name" className={forms.label}>
            Name <span className={styles.required}>*</span>
          </label>
          <input
            id="venue-name"
            className={`${forms.input} ${styles.plain}`}
            required
            placeholder="e.g. Sunny loft in the old town"
            value={values.name}
            onChange={(event) => change('name', event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'venue-name-error' : undefined}
          />
          {errors.name && (
            <p id="venue-name-error" className={forms.error}>
              {errors.name}
            </p>
          )}
        </div>

        <div className={forms.field}>
          <label htmlFor="venue-description" className={forms.label}>
            Description <span className={styles.required}>*</span>
          </label>
          <textarea
            id="venue-description"
            className={`${forms.input} ${styles.plain} ${styles.textarea}`}
            required
            rows={4}
            placeholder="What makes the place special? Rooms, view, what is nearby…"
            value={values.description}
            onChange={(event) => change('description', event.target.value)}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? 'venue-description-error' : undefined}
          />
          {errors.description && (
            <p id="venue-description-error" className={forms.error}>
              {errors.description}
            </p>
          )}
        </div>

        <div className={styles.row}>
          <div className={forms.field}>
            <label htmlFor="venue-price" className={forms.label}>
              Price per night ($) <span className={styles.required}>*</span>
            </label>
            <div className={forms.inputWrap}>
              <DollarSign size={20} aria-hidden="true" />
              <input
                id="venue-price"
                className={forms.input}
                type="number"
                inputMode="decimal"
                min="1"
                required
                placeholder="0"
                value={values.price}
                onChange={(event) => change('price', event.target.value)}
                aria-invalid={Boolean(errors.price)}
                aria-describedby={errors.price ? 'venue-price-error' : undefined}
              />
            </div>
            {errors.price && (
              <p id="venue-price-error" className={forms.error}>
                {errors.price}
              </p>
            )}
          </div>

          <div className={forms.field}>
            <label htmlFor="venue-guests" className={forms.label}>
              Max guests <span className={styles.required}>*</span>
            </label>
            <div className={forms.inputWrap}>
              <Users size={20} aria-hidden="true" />
              <input
                id="venue-guests"
                className={forms.input}
                type="number"
                inputMode="numeric"
                min="1"
                max={MAX_GUESTS}
                required
                placeholder="1"
                value={values.maxGuests}
                onChange={(event) => change('maxGuests', event.target.value)}
                aria-invalid={Boolean(errors.maxGuests)}
                aria-describedby="venue-guests-note"
              />
            </div>
            <p id="venue-guests-note" className={errors.maxGuests ? forms.error : forms.hint}>
              {errors.maxGuests ?? `From 1 to ${MAX_GUESTS}`}
            </p>
          </div>
        </div>
      </fieldset>

      <fieldset className={styles.section}>
        <legend className={styles.legend}>
          Photos <span className={styles.optional}>optional · first photo is the cover</span>
        </legend>

        <ul className={styles.photos}>
          {values.photos.map((photo, index) => {
            const url = photo.url.trim()
            const error = errors.photos?.[photo.id]
            return (
              <li key={photo.id} className={styles.photo}>
                <div className={styles.thumb}>
                  <VenueImage
                    media={isHttpsUrl(url) ? { url, alt: '' } : undefined}
                    fallbackAlt={`Photo ${index + 1}`}
                    className={styles.thumbImage}
                  />
                  {index === 0 && <span className={styles.cover}>Cover</span>}
                </div>

                <div className={`${forms.field} ${styles.photoUrl}`}>
                  <label htmlFor={`photo-url-${photo.id}`} className={forms.label}>
                    Image URL
                  </label>
                  <input
                    id={`photo-url-${photo.id}`}
                    className={`${forms.input} ${styles.plain}`}
                    type="url"
                    inputMode="url"
                    placeholder="https://…"
                    value={photo.url}
                    onChange={(event) => changePhoto(photo.id, 'url', event.target.value)}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `photo-error-${photo.id}` : undefined}
                  />
                  {error && (
                    <p id={`photo-error-${photo.id}`} className={forms.error}>
                      {error}
                    </p>
                  )}
                </div>

                <div className={`${forms.field} ${styles.photoAlt}`}>
                  <label htmlFor={`photo-alt-${photo.id}`} className={forms.label}>
                    Alt text
                  </label>
                  <input
                    id={`photo-alt-${photo.id}`}
                    className={`${forms.input} ${styles.plain}`}
                    maxLength={MAX_ALT}
                    placeholder="Describe the photo"
                    value={photo.alt}
                    onChange={(event) => changePhoto(photo.id, 'alt', event.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className={styles.remove}
                  aria-label={`Remove photo ${index + 1}`}
                  onClick={() =>
                    change(
                      'photos',
                      values.photos.filter((item) => item.id !== photo.id)
                    )
                  }
                >
                  <Trash2 size={20} aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          className={`${buttons.secondary} ${styles.add}`}
          onClick={() => change('photos', [...values.photos, newPhoto()])}
        >
          <Plus size={18} aria-hidden="true" />
          Add photo
        </button>
      </fieldset>

      <fieldset className={styles.section}>
        <legend className={styles.legend}>Amenities</legend>
        <div className={styles.amenities}>
          {AMENITIES.map(({ key, label }) => (
            <label key={key} className={styles.check}>
              <input
                type="checkbox"
                checked={values.meta[key]}
                onChange={(event) =>
                  change('meta', { ...values.meta, [key]: event.target.checked })
                }
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.section}>
        <legend className={styles.legend}>
          Location <span className={styles.optional}>optional</span>
        </legend>
        <div className={styles.row}>
          <div className={forms.field}>
            <label htmlFor="venue-city" className={forms.label}>
              City
            </label>
            <input
              id="venue-city"
              className={`${forms.input} ${styles.plain}`}
              placeholder="City"
              value={values.city}
              onChange={(event) => change('city', event.target.value)}
            />
          </div>
          <div className={forms.field}>
            <label htmlFor="venue-country" className={forms.label}>
              Country
            </label>
            <input
              id="venue-country"
              className={`${forms.input} ${styles.plain}`}
              placeholder="Country"
              value={values.country}
              onChange={(event) => change('country', event.target.value)}
            />
          </div>
        </div>
      </fieldset>

      <div className={styles.actions}>
        <button type="button" className={buttons.secondary} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={buttons.primary} disabled={isSending}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

export default VenueForm