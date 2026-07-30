'use client'

import { useState } from 'react'
import { getDictionary, type Locale } from '@/lib/i18n'

/* ---------------------------------------------------------------------------
   ContactForm
   ---------------------------------------------------------------------------
   Accessibility contract:
     - a visible <label> per field, never placeholder-only
     - inline errors tied to their field via aria-describedby
     - success confirmation announced via aria-live

   Beyond that: validation moves focus to the first bad field, so a keyboard or
   screen-reader user is taken straight to the problem rather than left to hunt.

   NOTE: /api/enquiry validates and logs but does NOT send mail — no provider
   credential exists yet. See the route file.
--------------------------------------------------------------------------- */

type Errors = Partial<Record<'name' | 'email' | 'message', string>>
type Status = 'idle' | 'submitting' | 'sent' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function ContactForm({ locale }: { locale: Locale }) {
  const d = getDictionary(locale)
  const f = d.contact.form
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')

  const validate = (data: FormData): Errors => {
    const next: Errors = {}
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    if (!name) next.name = f.errName
    if (!email) next.email = f.errEmailEmpty
    else if (!EMAIL_RE.test(email)) next.email = f.errEmailInvalid
    if (!message) next.message = f.errMessage

    return next
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const found = validate(data)
    setErrors(found)

    const firstBad = (['name', 'email', 'message'] as const).find((k) => found[k])
    if (firstBad) {
      form.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus()
      return
    }

    setStatus('submitting')
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...Object.fromEntries(data), locale }),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  const fieldClass = (hasError: boolean) =>
    `mt-2 w-full rounded-sm border bg-cream px-4 py-3 text-base text-ink transition-colors duration-200 ${
      hasError ? 'border-bronze-deep' : 'border-bronze/30 hover:border-bronze/60'
    }`

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          {f.name} <span aria-hidden="true">*</span>
          <span className="sr-only">{f.required}</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-required="true"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={fieldClass(!!errors.name)}
        />
        {errors.name && (
          <p id="name-error" className="mt-2 text-sm font-medium text-bronze-deep">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          {f.email} <span aria-hidden="true">*</span>
          <span className="sr-only">{f.required}</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'email-error email-hint' : 'email-hint'}
          className={fieldClass(!!errors.email)}
        />
        <p id="email-hint" className="mt-2 text-sm text-bronze-deep">
          {f.emailHint}
        </p>
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm font-medium text-bronze-deep">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="villa" className="block text-sm font-medium">
          {f.villa}
        </label>
        <select
          id="villa"
          name="villa"
          defaultValue=""
          className={`${fieldClass(false)} cursor-pointer`}
        >
          <option value="">{f.villaAny}</option>
          {d.villas.names.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="arrival" className="block text-sm font-medium">
            {f.arrival}
          </label>
          <input
            id="arrival"
            name="arrival"
            type="date"
            className={`${fieldClass(false)} cursor-pointer`}
          />
        </div>
        <div>
          <label htmlFor="departure" className="block text-sm font-medium">
            {f.departure}
          </label>
          <input
            id="departure"
            name="departure"
            type="date"
            className={`${fieldClass(false)} cursor-pointer`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          {f.message} <span aria-hidden="true">*</span>
          <span className="sr-only">{f.required}</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-required="true"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={fieldClass(!!errors.message)}
        />
        {errors.message && (
          <p id="message-error" className="mt-2 text-sm font-medium text-bronze-deep">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="tap-target inline-flex cursor-pointer items-center rounded-sm bg-bronze px-7 text-sm font-medium tracking-wide text-white transition-colors duration-200 hover:bg-bronze-deep disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'submitting' ? f.submitting : f.submit}
      </button>

      {/*
        Always present in the DOM — an aria-live region added to the page at the
        same moment its text appears is unreliably announced, so it must exist
        empty and be filled later.
      */}
      <p aria-live="polite" role="status" className="min-h-6 text-sm font-medium">
        {status === 'sent' && f.success}
        {status === 'error' && f.failure}
      </p>
    </form>
  )
}
