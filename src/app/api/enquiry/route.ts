import { NextResponse } from 'next/server'

/* ---------------------------------------------------------------------------
   POST /api/enquiry
   ---------------------------------------------------------------------------
   !! THIS DOES NOT SEND EMAIL YET !!

   It validates the payload and logs it server-side, so the form's success and
   error paths are genuinely exercisable end to end. Actually delivering the
   enquiry needs a provider credential, which does not exist in this project.

   To finish it, pick a provider and add the send call where marked below:

     Resend    npm i resend       RESEND_API_KEY
     Postmark  npm i postmark     POSTMARK_SERVER_TOKEN
     SMTP      npm i nodemailer   SMTP_HOST / SMTP_USER / SMTP_PASS

   The existing guest app already sends branded mail, so its provider and
   templates are the obvious thing to reuse here.

   Also still to do before launch: rate limiting (this endpoint is open to the
   internet and will be scraped by bots) and a spam check.
--------------------------------------------------------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MAX_MESSAGE = 4000

type Payload = {
  name?: string
  email?: string
  message?: string
  villa?: string
  arrival?: string
  departure?: string
}

export async function POST(request: Request) {
  let body: Payload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim()
  const message = String(body.message ?? '').trim()

  /* Server-side validation mirrors the client's. The client check is a
     convenience; this one is the actual guard. */
  const fieldErrors: Record<string, string> = {}
  if (!name) fieldErrors.name = 'Name is required.'
  if (!email) fieldErrors.email = 'Email is required.'
  else if (!EMAIL_RE.test(email)) fieldErrors.email = 'Email is not valid.'
  if (!message) fieldErrors.message = 'Message is required.'
  else if (message.length > MAX_MESSAGE)
    fieldErrors.message = 'Message is too long.'

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ fieldErrors }, { status: 422 })
  }

  const enquiry = {
    name,
    email,
    message,
    villa: String(body.villa ?? '').trim() || 'No preference',
    arrival: String(body.arrival ?? '').trim() || null,
    departure: String(body.departure ?? '').trim() || null,
    receivedAt: new Date().toISOString(),
  }

  // TODO: send the email here. Until then the enquiry only reaches the logs,
  // which means a real visitor's enquiry would be silently lost in production.
  console.info('[enquiry] received', enquiry)

  return NextResponse.json({ ok: true }, { status: 200 })
}
