'use client'

import { useState } from 'react'

interface FormErrors {
  firstName?: string
  lastName?:  string
  email?:     string
  message?:   string
}

function validate(fields: {
  firstName: string
  lastName:  string
  email:     string
  message:   string
}): FormErrors {
  const errors: FormErrors = {}
  if (fields.firstName.trim().length < 2)  errors.firstName = 'Please enter your first name.'
  if (fields.lastName.trim().length < 2)   errors.lastName  = 'Please enter your last name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errors.email = 'Please enter a valid email address.'
  if (fields.message.trim().length < 10)   errors.message   = 'Please enter a message (at least 10 characters).'
  return errors
}

const CONTACT_INFO = [
  { label: 'Address',    value: 'Carrer de sa Creu, 12\n07800 Ibiza, Spain' },
  { label: 'Phone',      value: '+34 971 XXX XXX' },
  { label: 'Email',      value: 'info@2ibiza.com'  },
  { label: 'WhatsApp',   value: '+34 6XX XXX XXX'  },
]

const ERROR_COLOR = 'rgba(185,60,60,0.6)'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [errors,    setErrors]    = useState<FormErrors>({})

  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [phone,     setPhone]     = useState('')
  const [subject,   setSubject]   = useState('')
  const [message,   setMessage]   = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate({ firstName, lastName, email, message })
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSubmitted(true)
  }

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: 'var(--bg-deep)',
          paddingTop:      'clamp(6rem, 10vw, 8rem)',
          paddingBottom:   'clamp(3rem, 5vw, 4rem)',
        }}
      >
        <div
          className="mx-auto"
          style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
        >
          <div className="eyebrow-row mb-[10px]">
            <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>Get in Touch</span>
          </div>
          <h1
            className="font-serif"
            style={{
              color:         'var(--text-on-dark)',
              fontWeight:    500,
              letterSpacing: '-0.025em',
              fontSize:      'clamp(2.75rem, 5vw, 4rem)',
              marginTop:     '12px',
            }}
          >
            Contact Us
          </h1>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: 'var(--bg-canvas)', paddingBlock: 'clamp(3rem, 5vw, 5rem)' }}>
        <div
          className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16"
          style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
        >

          {/* ── Form ─────────────────────────────────────────────── */}
          <div>
            <h2
              className="font-serif"
              style={{
                color:        'var(--text-primary)',
                fontWeight:   500,
                fontSize:     'clamp(1.5rem, 2.5vw, 2rem)',
                marginBottom: '2rem',
              }}
            >
              Send us a Message
            </h2>

            {submitted ? (
              <div
                style={{
                  backgroundColor: 'var(--bg-canvas-soft)',
                  border:          '1px solid var(--border-soft)',
                  padding:         '2rem',
                }}
              >
                <p
                  className="font-serif"
                  style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 400 }}
                >
                  Thank you.
                </p>
                <p className="type-body-sm" style={{ color: 'var(--text-secondary)' }}>
                  We will be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="label-base">First Name</label>
                    <input
                      id="firstName"
                      placeholder="First Name"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="input-base"
                      style={errors.firstName ? { borderColor: ERROR_COLOR } : undefined}
                    />
                    {errors.firstName && (
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: ERROR_COLOR, marginTop: '4px' }}>
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="label-base">Last Name</label>
                    <input
                      id="lastName"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="input-base"
                      style={errors.lastName ? { borderColor: ERROR_COLOR } : undefined}
                    />
                    {errors.lastName && (
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: ERROR_COLOR, marginTop: '4px' }}>
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="label-base">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-base"
                    style={errors.email ? { borderColor: ERROR_COLOR } : undefined}
                  />
                  {errors.email && (
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: ERROR_COLOR, marginTop: '4px' }}>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="label-base">Phone Number (optional)</label>
                  <input
                    id="phone"
                    placeholder="+34 6XX XXX XXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="input-base"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="label-base">How can we help?</label>
                  <select
                    id="subject"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="input-base"
                    style={{
                      appearance: 'none',
                      cursor:     'pointer',
                      color:      subject ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    }}
                  >
                    <option value="">Select a topic</option>
                    <option>I want to buy a property</option>
                    <option>I want to sell a property</option>
                    <option>I want a property valuation</option>
                    <option>General enquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="label-base">Your message</label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Your message..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="input-base"
                    style={{
                      height:  'auto',
                      padding: '14px 18px',
                      resize:  'none',
                      ...(errors.message ? { borderColor: ERROR_COLOR } : {}),
                    }}
                  />
                  {errors.message && (
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: ERROR_COLOR, marginTop: '4px' }}>
                      {errors.message}
                    </p>
                  )}
                </div>

                <button type="submit" className="btn-primary" style={{ height: '52px' }}>
                  Send Message →
                </button>

              </form>
            )}
          </div>

          {/* ── Office Info ───────────────────────────────────────── */}
          <div>
            <h2
              className="font-serif"
              style={{
                color:        'var(--text-primary)',
                fontWeight:   500,
                fontSize:     'clamp(1.5rem, 2.5vw, 2rem)',
                marginBottom: '2rem',
              }}
            >
              Our Office
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {CONTACT_INFO.map(item => (
                <div key={item.label}>
                  <p
                    className="type-eyebrow"
                    style={{ color: 'var(--accent-stone)', letterSpacing: '0.14em', marginBottom: '5px' }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="type-body-sm"
                    style={{ color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}

              <div>
                <p
                  className="type-eyebrow"
                  style={{ color: 'var(--accent-stone)', letterSpacing: '0.14em', marginBottom: '8px' }}
                >
                  Office Hours
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    'Monday – Friday: 9:00 – 18:00',
                    'Saturday: 10:00 – 14:00',
                    'Sunday: By appointment',
                  ].map(line => (
                    <p key={line} className="type-body-sm" style={{ color: 'var(--text-secondary)' }}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
