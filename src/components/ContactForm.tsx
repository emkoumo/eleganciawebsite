'use client'

import { useRef, useState } from 'react'
import { villas } from '@/lib/site'

/* ---------------------------------------------------------------------------
   ContactForm
   ---------------------------------------------------------------------------
   Accessibility contract from the brief:
     - visible <label> per field, never placeholder-only
     - inline errors tied to their field via aria-describedby
     - success confirmation announced via aria-live

   Beyond that: validation errors move focus to the first bad field, and the
   error text is rendered inside the same aria-describedby target as the hint,
   so a screen reader reads "Email. Required. Enter a valid email address."
   rather than leaving the user to hunt for what went wrong.

   NOTE: /api/enquiry currently validates and logs the enquiry but does not
   send mail — no provider credentials exist yet. See the route file.
--------------------------------------------------------------------------- */

type Errors = Partial<Record<'name' | 'email' | 'message', string>>
type Status = 'idle' | 'submitting' | 'sent' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  const validate = (data: FormData): Errors => {
    const next: Errors = {}
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    if (!name) next.name = 'Please enter your name.'
    if (!email) next.email = 'Please enter your email address.'
    else if (!EMAIL_RE.test(email))
      next.email = 'Enter a valid email address, for example name@example.com.'
    if (!message) next.message = 'Please tell us a little about your stay.'

    return next
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const found = validate(data)
    setErrors(found)

    /* Move focus to the first field with an error so keyboard and screen
       reader users are taken straight to the problem. */
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
        body: JSON.stringify(Object.fromEntries(data)),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  const fieldClass = (hasError: boolean) =>
    `mt-2 w-full rounded-sm border bg-cream px-4 py-3 text-base text-ink transition-colors duration-200 placeholder:text-bronze-deep/50 ${
      hasError ? 'border-bronze-deep' : 'border-bronze/30 hover:border-bronze/60'
    }`

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-6">
      {/* Name ------------------------------------------------------------- */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Your name <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
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

      {/* Email ------------------------------------------------------------ */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email address <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={
            errors.email ? 'email-error email-hint' : 'email-hint'
          }
          className={fieldClass(!!errors.email)}
        />
        <p id="email-hint" className="mt-2 text-sm text-bronze-deep">
          We reply within 24 hours.
        </p>
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm font-medium text-bronze-deep">
            {errors.email}
          </p>
        )}
      </div>

      {/* Villa ------------------------------------------------------------ */}
      <div>
        <label htmlFor="villa" className="block text-sm font-medium">
          Which villa interests you?
        </label>
        <select
          id="villa"
          name="villa"
          defaultValue=""
          className={`${fieldClass(false)} cursor-pointer`}
        >
          <option value="">No preference</option>
          {villas.map((villa) => (
            <option key={villa.id} value={villa.name}>
              {villa.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dates ------------------------------------------------------------ */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="arrival" className="block text-sm font-medium">
            Arrival
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
            Departure
          </label>
          <input
            id="departure"
            name="departure"
            type="date"
            className={`${fieldClass(false)} cursor-pointer`}
          />
        </div>
      </div>

      {/* Message ---------------------------------------------------------- */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Your message <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
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
          <p
            id="message-error"
            className="mt-2 text-sm font-medium text-bronze-deep"
          >
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="tap-target inline-flex cursor-pointer items-center rounded-sm bg-bronze px-7 text-sm font-medium tracking-wide text-white transition-colors duration-200 hover:bg-bronze-deep disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
      </button>

      {/*
        Status region. Always present in the DOM — an aria-live region that is
        added to the page at the same moment its text appears is unreliably
        announced, so it must exist empty and be filled later.
      */}
      <p
        aria-live="polite"
        role="status"
        className="min-h-6 text-sm font-medium"
      >
        {status === 'sent' &&
          'Thank you — your enquiry has been sent. We will reply within 24 hours.'}
        {status === 'error' &&
          'Something went wrong sending your enquiry. Please email us directly instead.'}
      </p>
    </form>
  )
}
