'use client'

import { useState } from 'react'
import Image from 'next/image'

// ─── Static data ────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    headline: 'Accurate local market insight',
    detail:   'Based on live Ibiza transaction data and current buyer demand.',
  },
  {
    headline: 'Discreet access to qualified buyers',
    detail:   'Our private network is active, international and pre-qualified.',
  },
  {
    headline: 'Guidance from listing to completion',
    detail:   'Expert support through every stage of the sale process.',
  },
]

const TRUST_SIGNALS = [
  'Local Ibiza specialists',
  'Discreet network of buyers',
  'Data-driven market valuations',
]

// Common country codes — ordered by likely audience
const COUNTRY_CODES = [
  { code: '+34', label: 'ES +34' },
  { code: '+44', label: 'GB +44' },
  { code: '+1',  label: 'US +1'  },
  { code: '+49', label: 'DE +49' },
  { code: '+33', label: 'FR +33' },
  { code: '+39', label: 'IT +39' },
  { code: '+31', label: 'NL +31' },
  { code: '+41', label: 'CH +41' },
  { code: '+46', label: 'SE +46' },
  { code: '+47', label: 'NO +47' },
  { code: '+45', label: 'DK +45' },
  { code: '+32', label: 'BE +32' },
  { code: '+351', label: 'PT +351' },
  { code: '+7',  label: 'RU +7'  },
  { code: '+971', label: 'AE +971' },
  { code: '+61', label: 'AU +61' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function ValuationCTA() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    firstName:   '',
    lastName:    '',
    email:       '',
    countryCode: '+34',
    phone:       '',
  })

  const set = (k: keyof typeof form) => (v: string) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section
      className="relative section-major-dark overflow-hidden"
      style={{ backgroundColor: 'var(--bg-deep)' }}
    >
      {/* Subtle architectural texture at 8% opacity */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=60"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          style={{ opacity: 0.08 }}
        />
      </div>

      <div
        className="relative z-10 mx-auto"
        style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 xl:gap-20 items-start">

          {/* ── A. Left: Headline + benefits ─────────────────────────── */}
          <div>
            <div className="eyebrow-row mb-[10px]">
              <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>
                Sell with 2Ibiza
              </span>
            </div>

            <h2
              className="font-serif"
              style={{
                color:         'var(--text-on-dark)',
                fontWeight:    500,
                lineHeight:    1.1,
                letterSpacing: '-0.025em',
                marginBottom:  '26px',
              }}
            >
              What is your Ibiza<br />
              property worth?
            </h2>

            <p
              className="type-body"
              style={{
                color:        'rgba(245,240,232,0.76)',
                lineHeight:   1.78,
                maxWidth:     '44ch',
                marginBottom: '52px',
              }}
            >
              Receive a confidential market valuation from local Ibiza experts.
              Whether you are ready to sell or simply exploring your options —
              there is no obligation.
            </p>

            {/* Benefits list */}
            <ul className="list-none p-0 m-0">
              {BENEFITS.map((b, i) => (
                <li
                  key={b.headline}
                  style={{
                    borderTop:     '1px solid var(--border-dark)',
                    paddingTop:    'clamp(18px, 2.2vw, 24px)',
                    paddingBottom: 'clamp(18px, 2.2vw, 24px)',
                  }}
                >
                  <div className="flex gap-4 items-start">
                    <span
                      className="font-sans shrink-0"
                      style={{
                        fontSize:      '10px',
                        fontWeight:    500,
                        letterSpacing: '0.14em',
                        color:         'var(--accent-sand)',
                        paddingTop:    '3px',
                        width:         '20px',
                      }}
                    >
                      0{i + 1}
                    </span>
                    <div>
                      <p
                        style={{
                          fontFamily:    'var(--font-sans)',
                          fontSize:      '14px',
                          fontWeight:    500,
                          color:         'var(--text-on-dark)',
                          letterSpacing: '0.01em',
                          marginBottom:  '4px',
                        }}
                      >
                        {b.headline}
                      </p>
                      <p
                        className="type-body-sm"
                        style={{
                          color:        'rgba(245,240,232,0.70)',
                          lineHeight:   1.7,
                          marginBottom: 0,
                        }}
                      >
                        {b.detail}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
              <li style={{ borderTop: '1px solid var(--border-dark)' }} />
            </ul>
          </div>

          {/* ── B. Right: Form card ───────────────────────────────────── */}
          <div
            style={{
              backgroundColor: 'var(--surface-primary)',
              border:          '1px solid var(--border-muted)',
              padding:         'clamp(28px, 4vw, 44px)',
              boxShadow:       'var(--shadow-hover)',
            }}
          >
            {submitted ? (
              <SuccessState />
            ) : (
              <>
                {/* Form header */}
                <h3
                  className="font-serif"
                  style={{
                    fontSize:      'clamp(1.125rem, 1.6vw, 1.375rem)',
                    fontWeight:    500,
                    lineHeight:    1.2,
                    color:         'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    marginBottom:  '28px',
                  }}
                >
                  Request a confidential<br />property valuation.
                </h3>

                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* First + Last name — side by side */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label-base">First Name</label>
                        <input
                          required
                          type="text"
                          placeholder="First name"
                          className="input-base"
                          style={{ minHeight: '52px', padding: '14px 16px' }}
                          value={form.firstName}
                          onChange={e => set('firstName')(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="label-base">Last Name</label>
                        <input
                          required
                          type="text"
                          placeholder="Last name"
                          className="input-base"
                          style={{ minHeight: '52px', padding: '14px 16px' }}
                          value={form.lastName}
                          onChange={e => set('lastName')(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="label-base">Email Address</label>
                      <input
                        required
                        type="email"
                        placeholder="your@email.com"
                        className="input-base"
                        style={{ minHeight: '52px', padding: '14px 16px' }}
                        value={form.email}
                        onChange={e => set('email')(e.target.value)}
                      />
                    </div>

                    {/* Phone — country code + number */}
                    <div>
                      <label className="label-base">
                        Phone
                        <span
                          style={{
                            fontWeight:    400,
                            letterSpacing: 0,
                            textTransform: 'none',
                            opacity:       0.5,
                            marginLeft:    '6px',
                          }}
                        >
                          optional
                        </span>
                      </label>
                      <div className="flex gap-2">
                        {/* Country code selector */}
                        <div className="relative shrink-0" style={{ width: '110px' }}>
                          <select
                            className="input-base w-full cursor-pointer"
                            style={{ minHeight: '52px', padding: '14px 28px 14px 12px', fontSize: '13px' }}
                            value={form.countryCode}
                            onChange={e => set('countryCode')(e.target.value)}
                          >
                            {COUNTRY_CODES.map(c => (
                              <option key={c.code} value={c.code}>{c.label}</option>
                            ))}
                          </select>
                          <span
                            className="absolute right-2 top-1/2 pointer-events-none"
                            style={{
                              transform:  'translateY(-50%)',
                              color:      'var(--text-tertiary)',
                              fontSize:   '10px',
                              lineHeight: 1,
                            }}
                          >
                            ▾
                          </span>
                        </div>
                        {/* Number */}
                        <input
                          type="tel"
                          placeholder="Phone number"
                          className="input-base flex-1"
                          style={{ minHeight: '52px', padding: '14px 16px' }}
                          value={form.phone}
                          onChange={e => set('phone')(e.target.value)}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn-primary w-full group"
                    style={{ marginTop: '24px' }}
                  >
                    Request My Valuation
                    <span
                      className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden
                    >
                      →
                    </span>
                  </button>

                  <p
                    className="type-caption"
                    style={{
                      color:        'var(--text-tertiary)',
                      textAlign:    'center',
                      marginTop:    '12px',
                      lineHeight:   1.6,
                      marginBottom: 0,
                    }}
                  >
                    A member of our team will review your property<br />
                    and contact you within 24 hours.
                  </p>
                </form>

                {/* Trust signals */}
                <div
                  style={{
                    marginTop:  '24px',
                    paddingTop: '20px',
                    borderTop:  '1px solid var(--border-muted)',
                  }}
                >
                  <p
                    className="type-caption"
                    style={{
                      color:        'var(--text-tertiary)',
                      textAlign:    'center',
                      marginBottom: '12px',
                    }}
                  >
                    Your enquiry is completely confidential and without obligation.
                  </p>
                  <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
                    {TRUST_SIGNALS.map(s => (
                      <span
                        key={s}
                        className="type-caption flex items-center gap-1.5"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <span style={{ color: 'var(--accent-sand)', fontSize: '8px' }}>●</span>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Phone CTA */}
                <p
                  className="type-caption"
                  style={{
                    color:        'var(--text-secondary)',
                    textAlign:    'center',
                    marginTop:    '18px',
                    marginBottom: 0,
                  }}
                >
                  Or speak with our team directly{' '}
                  <a
                    href="tel:+34971000000"
                    style={{
                      color:          'var(--cta-primary-bg)',
                      textDecoration: 'none',
                      fontWeight:     500,
                      whiteSpace:     'nowrap',
                    }}
                  >
                    +34 971 000 000 →
                  </a>
                </p>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessState() {
  return (
    <div className="py-10 text-center">
      <div
        className="mx-auto flex items-center justify-center"
        style={{
          width:           '48px',
          height:          '48px',
          backgroundColor: 'var(--cta-primary-bg)',
          marginBottom:    '24px',
        }}
      >
        <span style={{ color: 'var(--text-on-dark)', fontSize: '20px', lineHeight: 1 }}>✓</span>
      </div>

      <h3
        className="font-serif"
        style={{
          fontSize:      'clamp(1.75rem, 2.8vw, 2.25rem)',
          fontWeight:    500,
          color:         'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom:  '12px',
        }}
      >
        Thank you.
      </h3>

      <p
        className="type-body-sm"
        style={{
          color:      'var(--text-secondary)',
          lineHeight: 1.75,
          maxWidth:   '34ch',
          margin:     '0 auto',
        }}
      >
        Your enquiry has been received. A member of our team will
        review your property and contact you within 24 hours.
      </p>

      <div
        style={{
          marginTop:  '32px',
          paddingTop: '24px',
          borderTop:  '1px solid var(--border-muted)',
        }}
      >
        <p
          className="type-caption"
          style={{ color: 'var(--text-tertiary)', marginBottom: 0 }}
        >
          Your information is completely confidential and will never
          be shared with third parties.
        </p>
      </div>
    </div>
  )
}
