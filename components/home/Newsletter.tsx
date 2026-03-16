'use client'

import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail]       = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <section
      style={{
        backgroundColor: 'var(--bg-section-muted)',
        borderTop:        '1px solid var(--border-muted)',
        paddingBlock:     'clamp(56px, 7vw, 80px)',
      }}
    >
      <div
        className="mx-auto text-center"
        style={{
          maxWidth:      '600px',
          paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
        }}
      >

        {/* Eyebrow */}
        <p
          className="type-eyebrow"
          style={{ color: 'var(--cta-primary-bg)', marginBottom: '18px' }}
        >
          The 2ibiza Journal
        </p>

        {/* Headline */}
        <h2
          className="font-serif"
          style={{
            color:         'var(--text-primary)',
            fontWeight:    500,
            fontSize:      'clamp(1.875rem, 3.2vw, 2.5rem)',
            lineHeight:    1.1,
            letterSpacing: '-0.025em',
            marginBottom:  '16px',
          }}
        >
          Stay ahead of the Ibiza market.
        </h2>

        {/* Body */}
        <p
          className="type-body"
          style={{
            color:      'var(--text-secondary)',
            lineHeight: 1.72,
            maxWidth:   '480px',
            margin:     '0 auto 36px',
          }}
        >
          Subscribe to our newsletter for the latest market insights,
          exclusive properties, and off-market opportunities.
        </p>

        {/* Form / Success */}
        {submitted ? (
          <div style={{ marginBottom: '24px' }}>
            <p
              className="type-body"
              style={{ color: 'var(--cta-primary-bg)', fontWeight: 500, marginBottom: 0 }}
            >
              Thank you — you're on the list.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
            style={{ marginBottom: '24px' }}
          >
            <input
              required
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1"
              style={{
                fontFamily:      'var(--font-sans)',
                fontSize:        '14px',
                fontWeight:      400,
                color:           'var(--text-primary)',
                backgroundColor: 'var(--surface-primary)',
                border:          '1px solid var(--border-soft)',
                padding:         '0 18px',
                height:          '52px',
                outline:         'none',
                transition:      'border-color var(--transition-ui)',
              }}
              onFocus={e  => { e.currentTarget.style.borderColor = 'var(--cta-primary-bg)' }}
              onBlur={e   => { e.currentTarget.style.borderColor = 'var(--border-soft)'   }}
            />
            <button
              type="submit"
              className="btn-primary shrink-0 group"
              style={{ height: '52px', paddingInline: '28px' }}
            >
              Subscribe
              <span
                className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </button>
          </form>
        )}

        {/* Trust tagline */}
        <p
          className="type-caption"
          style={{
            color:         'var(--text-tertiary)',
            letterSpacing: '0.08em',
            marginBottom:  0,
          }}
        >
          Discreet. Professional. Insightful.
        </p>

      </div>
    </section>
  )
}
