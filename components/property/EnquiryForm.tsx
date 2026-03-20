'use client'

import { useState } from 'react'

interface EnquiryFormProps {
  propertyTitle: string
  /** When true, renders inputs in the dark-surface variant */
  dark?: boolean
}

interface FormErrors {
  name?:  string
  email?: string
}

function validate(name: string, email: string): FormErrors {
  const errors: FormErrors = {}
  if (name.trim().length < 2)  errors.name  = 'Please enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Please enter a valid email address.'
  return errors
}

export default function EnquiryForm({ propertyTitle, dark = false }: EnquiryFormProps) {
  const [sending,   setSending]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors,    setErrors]    = useState<FormErrors>({})

  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [phone,   setPhone]   = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(name, email)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSubmitted(true)
    }, 1200)
  }

  const inputClass  = dark ? 'input-dark' : 'input-base'
  const labelClass  = dark ? 'label-dark'  : 'label-base'
  const headingColor = dark ? 'var(--text-on-dark)' : 'var(--text-primary)'
  const privacyColor = dark ? 'rgba(245,240,232,0.62)' : 'var(--text-tertiary)'
  const errorColor   = dark ? '#fca5a5' : '#dc2626'

  if (submitted) {
    return (
      <div
        style={{
          paddingBlock: '32px',
          textAlign:    'center',
          animation:    'fadeIn 400ms ease-out both',
        }}
      >
        <div
          style={{
            width:           '44px',
            height:          '44px',
            borderRadius:    '50%',
            border:          `1px solid ${dark ? 'rgba(245,240,232,0.20)' : 'var(--border-muted)'}`,
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            margin:          '0 auto 20px',
          }}
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
            <path d="M1 7L6.5 12.5L17 1" stroke="var(--cta-primary-bg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p
          className="font-serif"
          style={{ fontSize: '1.25rem', fontWeight: 500, color: headingColor, marginBottom: '8px' }}
        >
          Thank you.
        </p>
        <p className="type-body-sm" style={{ color: dark ? 'rgba(245,240,232,0.65)' : 'var(--text-secondary)' }}>
          We will be in touch within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* Heading — visible in both light and dark contexts */}
      <h3
        className="font-serif"
        style={{
          fontSize:      '1.375rem',
          fontWeight:    500,
          color:         headingColor,
          letterSpacing: '-0.01em',
          marginBottom:  '24px',
          lineHeight:    1.2,
        }}
      >
        Request Information
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        <div>
          <label htmlFor="enquiry-name" className={labelClass}>
            Your Name
          </label>
          <input
            id="enquiry-name"
            type="text"
            required
            placeholder="e.g. James Whitmore"
            value={name}
            onChange={e => {
              setName(e.target.value)
              if (errors.name) setErrors(prev => ({ ...prev, name: undefined }))
            }}
            className={inputClass}
            disabled={sending}
            style={errors.name ? { [dark ? 'borderBottomColor' : 'borderColor']: errorColor } : undefined}
          />
          {errors.name && (
            <p style={{ marginTop: '6px', fontSize: '12px', color: errorColor, fontFamily: 'var(--font-sans)' }}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="enquiry-email" className={labelClass}>
            Email Address
          </label>
          <input
            id="enquiry-email"
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={e => {
              setEmail(e.target.value)
              if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
            }}
            className={inputClass}
            disabled={sending}
            style={errors.email ? { [dark ? 'borderBottomColor' : 'borderColor']: errorColor } : undefined}
          />
          {errors.email && (
            <p style={{ marginTop: '6px', fontSize: '12px', color: errorColor, fontFamily: 'var(--font-sans)' }}>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="enquiry-phone" className={labelClass}>
            Phone
            <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none', opacity: 0.5, marginLeft: '6px' }}>
              optional
            </span>
          </label>
          <input
            id="enquiry-phone"
            type="tel"
            placeholder="+1 212 000 0000"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className={inputClass}
            disabled={sending}
          />
        </div>

        <div>
          <label htmlFor="enquiry-message" className={labelClass}>
            Message
            <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none', opacity: 0.5, marginLeft: '6px' }}>
              optional
            </span>
          </label>
          <textarea
            id="enquiry-message"
            rows={3}
            placeholder={`I am interested in ${propertyTitle}. Please send me more information.`}
            value={message}
            onChange={e => setMessage(e.target.value)}
            className={`${inputClass} resize-none`}
            disabled={sending}
          />
        </div>

      </div>

      <button
        type="submit"
        className="btn-primary w-full group"
        disabled={sending}
        style={{ opacity: sending ? 0.7 : 1, transition: 'opacity var(--transition-ui)', marginTop: '20px' }}
      >
        {sending ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span
              style={{
                width: '13px', height: '13px',
                border: '2px solid currentColor',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 0.7s linear infinite',
              }}
            />
            Sending…
          </span>
        ) : (
          <>
            Send Enquiry
            <span
              className="inline-block transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden
            >
              {' →'}
            </span>
          </>
        )}
      </button>

      <p className="type-caption text-center" style={{ color: privacyColor, marginTop: '12px' }}>
        Your details are kept strictly private
      </p>
    </form>
  )
}
