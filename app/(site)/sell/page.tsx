'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// ─── Static data ──────────────────────────────────────────────────────────────

const WHY_ITEMS = [
  {
    num:   '01',
    title: 'Honest Valuations',
    desc:  'We tell you what your property is worth — not what you want to hear.',
  },
  {
    num:   '02',
    title: 'Qualified Buyers',
    desc:  'Our buyer database is pre-qualified and internationally sourced. No time-wasters.',
  },
  {
    num:   '03',
    title: 'Discreet Sales',
    desc:  'Off-market introductions for clients who value privacy above everything.',
  },
  {
    num:   '04',
    title: 'Full Service',
    desc:  'Lawyers, notaries, currency exchange — we coordinate everything end-to-end.',
  },
]

const PROCESS_STEPS = [
  {
    num:   '01',
    title: 'Property Visit',
    desc:  'A local Ibiza specialist visits your property at your convenience — discreetly, and without any obligation whatsoever.',
  },
  {
    num:   '02',
    title: 'Market Analysis',
    desc:  'You receive a data-driven valuation report within 48 hours, benchmarked against comparable recent sales across the island.',
  },
  {
    num:   '03',
    title: 'You Decide',
    desc:  'We present a tailored sale strategy. You choose if, when, and how to proceed. No pressure. No hidden commitments.',
  },
]

const FAQS = [
  {
    q: 'Is my enquiry completely confidential?',
    a: 'Yes, absolutely. Your personal details and property information are never shared with third parties. All communications are handled discreetly by our dedicated team.',
  },
  {
    q: 'What does the valuation cost?',
    a: 'Nothing. Our market valuations are completely free and without obligation. We only work with you if and when you choose to proceed.',
  },
  {
    q: 'How long does it typically take to sell in Ibiza?',
    a: 'Premium Ibiza properties typically close within 2–6 months from instruction. Off-market introductions to pre-qualified buyers can be significantly faster for the right property.',
  },
  {
    q: 'Do you handle off-market sales?',
    a: 'Yes. We maintain a curated network of pre-qualified international buyers for clients who prefer complete privacy throughout the process. Many of our transactions are never publicly listed.',
  },
  {
    q: 'Will I need a Spanish lawyer?',
    a: 'We strongly recommend independent legal representation and can refer you to trusted Ibiza-based lawyers experienced in international transactions. Legal fees are separate from our commission.',
  },
]

const IBIZA_AREAS = [
  'Ibiza Town / Dalt Vila',
  'Talamanca',
  'Cap Martinet',
  'Can Ravi / Jesús',
  'Santa Eulàlia',
  'Es Caná / Cala Llenya',
  'San José / Cala Vedella',
  'San Antonio',
  'San Juan / North Ibiza',
  'Formentera',
  'Other / Not Sure',
]

const PROPERTY_TYPES = [
  'Villa',
  'Apartment',
  'Finca / Farmhouse',
  'Penthouse',
  'Townhouse',
  'Land / Plot',
  'Commercial',
]

const BEDROOMS = ['1', '2', '3', '4', '5', '6+']

const TIMELINES = [
  'As soon as possible',
  'Within 3–6 months',
  'Within 6–12 months',
  'Within 1–2 years',
  'Just exploring options',
]

const COUNTRY_CODES = [
  { code: '+34',  label: 'ES +34'  },
  { code: '+44',  label: 'GB +44'  },
  { code: '+1',   label: 'US +1'   },
  { code: '+49',  label: 'DE +49'  },
  { code: '+33',  label: 'FR +33'  },
  { code: '+39',  label: 'IT +39'  },
  { code: '+31',  label: 'NL +31'  },
  { code: '+41',  label: 'CH +41'  },
  { code: '+46',  label: 'SE +46'  },
  { code: '+47',  label: 'NO +47'  },
  { code: '+45',  label: 'DK +45'  },
  { code: '+32',  label: 'BE +32'  },
  { code: '+351', label: 'PT +351' },
  { code: '+7',   label: 'RU +7'   },
  { code: '+971', label: 'AE +971' },
  { code: '+61',  label: 'AU +61'  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function SellPage() {
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const formRef = useRef<HTMLElement>(null)

  const [form, setForm] = useState({
    firstName:    '',
    lastName:     '',
    email:        '',
    countryCode:  '+34',
    phone:        '',
    area:         '',
    propertyType: '',
    bedrooms:     '',
    timeline:     '',
    notes:        '',
  })

  const set = (k: keyof typeof form) => (v: string) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  // Show sticky bar once user scrolls past the hero
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > window.innerHeight * 0.65)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: 'var(--bg-deep)',
          paddingTop:      'clamp(6rem, 10vw, 9rem)',
          paddingBottom:   'clamp(3.5rem, 6vw, 5rem)',
          borderBottom:    '1px solid var(--border-dark)',
        }}
      >
        <div
          className="mx-auto"
          style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
        >
          <div style={{ maxWidth: '700px' }}>
            <div className="eyebrow-row mb-[10px]">
              <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>
                Free &amp; Confidential · No Obligation
              </span>
            </div>
            <h1
              className="font-serif"
              style={{
                color:         'var(--text-on-dark)',
                fontWeight:    500,
                letterSpacing: '-0.03em',
                lineHeight:    1.0,
                marginTop:     '14px',
                marginBottom:  '24px',
              }}
            >
              Sell your property{' '}
              <em className="italic" style={{ color: 'var(--accent-sand)' }}>
                the right way.
              </em>
            </h1>

            <p
              className="type-body"
              style={{
                color:     'var(--text-secondary)',
                lineHeight: 1.75,
                maxWidth:  '46ch',
              }}
            >
              Receive a confidential market valuation from local Ibiza specialists.
              No pressure. No obligation. Just honest expertise.
            </p>
          </div>
        </div>
      </div>


      {/* ── 3. Why Sell with 2ibiza ──────────────────────────────────────── */}
      <div className="section-major" style={{ backgroundColor: 'var(--bg-canvas)' }}>
        <div className="container-lg">
          <div className="eyebrow-row mb-[10px]">
            <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>Our Difference</span>
          </div>
          <h2
            className="font-serif"
            style={{
              color:        'var(--text-primary)',
              fontWeight:   500,
              marginTop:    '12px',
              marginBottom: 'clamp(2.5rem, 4vw, 4rem)',
            }}
          >
            Why sell with 2ibiza?
          </h2>

          {/* Gap-px grid — border lines come from parent background */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
            style={{ backgroundColor: 'var(--border-soft)' }}
          >
            {WHY_ITEMS.map(item => (
              <div
                key={item.title}
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  padding:         'clamp(1.75rem, 2.5vw, 2.5rem)',
                }}
              >
                <div
                  className="font-sans"
                  style={{
                    fontSize:      '11px',
                    fontWeight:    500,
                    letterSpacing: '0.16em',
                    color:         'var(--cta-primary-bg)',
                    marginBottom:  '1.25rem',
                  }}
                >
                  {item.num}
                </div>
                <h3
                  className="font-serif"
                  style={{
                    color:         'var(--text-primary)',
                    fontWeight:    500,
                    fontSize:      'clamp(1.125rem, 1.4vw, 1.25rem)',
                    letterSpacing: '-0.01em',
                    lineHeight:    1.2,
                    marginBottom:  '0.75rem',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="type-body-sm"
                  style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 0 }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. How It Works ─────────────────────────────────────────────── */}
      <div className="section-major" style={{ backgroundColor: 'var(--bg-section-muted)' }}>
        <div className="container-lg">
          <div className="eyebrow-row mb-[10px]">
            <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>The Process</span>
          </div>
          <h2
            className="font-serif"
            style={{
              color:        'var(--text-primary)',
              fontWeight:   500,
              marginTop:    '12px',
              marginBottom: 'clamp(2.5rem, 4vw, 4rem)',
            }}
          >
            Three steps to a successful sale.
          </h2>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-px"
            style={{ backgroundColor: 'var(--border-soft)' }}
          >
            {PROCESS_STEPS.map(step => (
              <div
                key={step.num}
                style={{
                  backgroundColor: 'var(--bg-section-muted)',
                  padding:         'clamp(2rem, 3vw, 3rem)',
                }}
              >
                <div
                  className="font-serif"
                  style={{
                    fontSize:      'clamp(3.5rem, 6vw, 5rem)',
                    fontWeight:    300,
                    color:         'var(--border-soft)',
                    lineHeight:    1,
                    letterSpacing: '-0.04em',
                    marginBottom:  '1.5rem',
                  }}
                >
                  {step.num}
                </div>
                <h3
                  className="font-serif"
                  style={{
                    color:         'var(--text-primary)',
                    fontWeight:    500,
                    fontSize:      'clamp(1.25rem, 1.8vw, 1.5rem)',
                    letterSpacing: '-0.015em',
                    lineHeight:    1.2,
                    marginBottom:  '0.875rem',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="type-body-sm"
                  style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 0 }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. Valuation Form ───────────────────────────────────────────── */}
      <section
        ref={formRef}
        id="valuation-form"
        className="relative overflow-hidden section-major-dark"
        style={{ backgroundColor: 'var(--bg-deep)' }}
      >
        {/* Subtle architectural texture */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <Image
            src="https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1920&q=60"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            style={{ opacity: 0.06 }}
          />
        </div>

        <div className="container-lg relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 xl:gap-24 items-start">

            {/* ── Left: Headline + what happens next ──────────────────── */}
            <div>
              <div className="eyebrow-row mb-[10px]">
                <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>
                  Free &amp; Confidential
                </span>
              </div>

              <h2
                className="font-serif"
                style={{
                  color:         'var(--text-on-dark)',
                  fontWeight:    500,
                  lineHeight:    1.06,
                  letterSpacing: '-0.03em',
                  marginTop:     '12px',
                  marginBottom:  '26px',
                }}
              >
                What is your Ibiza<br />
                property worth?
              </h2>

              <p
                className="type-body"
                style={{
                  color:        'var(--text-secondary)',
                  lineHeight:   1.78,
                  maxWidth:     '44ch',
                  marginBottom: '52px',
                }}
              >
                Receive a confidential market valuation from local Ibiza experts.
                Tell us about your property and we will arrange a visit at your
                convenience — with no obligation.
              </p>

              {/* What happens next */}
              <p
                className="type-eyebrow"
                style={{
                  color:        'var(--accent-sand)',
                  marginBottom: '20px',
                  opacity:      0.72,
                }}
              >
                What happens next
              </p>
              <ul className="list-none p-0 m-0">
                {PROCESS_STEPS.map((step, i) => (
                  <li
                    key={step.num}
                    style={{
                      borderTop:     '1px solid var(--border-dark)',
                      paddingBlock:  'clamp(18px, 2.2vw, 24px)',
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
                        {step.num}
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
                          {step.title}
                        </p>
                        <p
                          className="type-body-sm"
                          style={{
                            color:        'var(--text-secondary)',
                            lineHeight:   1.7,
                            marginBottom: 0,
                          }}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
                <li style={{ borderTop: '1px solid var(--border-dark)' }} />
              </ul>
            </div>

            {/* ── Right: Form card ──────────────────────────────────────── */}
            <div
              style={{
                backgroundColor: 'var(--surface-primary)',
                border:          '1px solid var(--border-muted)',
                padding:         'clamp(28px, 4vw, 48px)',
                boxShadow:       'var(--shadow-hover)',
              }}
            >
              {submitted ? (
                <SuccessState />
              ) : (
                <>
                  <h3
                    className="font-serif"
                    style={{
                      fontSize:      'clamp(1.5rem, 2vw, 1.875rem)',
                      fontWeight:    500,
                      lineHeight:    1.15,
                      color:         'var(--text-primary)',
                      letterSpacing: '-0.02em',
                      marginBottom:  '28px',
                    }}
                  >
                    Request a confidential<br />property valuation.
                  </h3>

                  <form onSubmit={handleSubmit} noValidate>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                      {/* First + Last name — stacked on mobile, side-by-side on sm+ */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="label-base">First Name *</label>
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
                          <label className="label-base">Last Name *</label>
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
                        <label className="label-base">Email Address *</label>
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

                      {/* Phone */}
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
                          <div className="relative shrink-0" style={{ minWidth: '100px', width: '110px' }}>
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
                              style={{ transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: '10px' }}
                            >
                              ▾
                            </span>
                          </div>
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

                      {/* Divider */}
                      <div style={{ borderTop: '1px solid var(--border-muted)', marginBlock: '2px' }} />
                      <p
                        className="type-caption"
                        style={{ color: 'var(--text-tertiary)', marginBottom: 0, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                      >
                        About your property
                      </p>

                      {/* Area / Location */}
                      <div>
                        <label className="label-base">Area / Location *</label>
                        <div className="relative">
                          <select
                            required
                            className="input-base w-full cursor-pointer"
                            style={{ minHeight: '52px', padding: '14px 36px 14px 16px', appearance: 'none' }}
                            value={form.area}
                            onChange={e => set('area')(e.target.value)}
                          >
                            <option value="" disabled>Select area…</option>
                            {IBIZA_AREAS.map(a => (
                              <option key={a} value={a}>{a}</option>
                            ))}
                          </select>
                          <span
                            className="absolute right-3 top-1/2 pointer-events-none"
                            style={{ transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: '10px' }}
                          >
                            ▾
                          </span>
                        </div>
                      </div>

                      {/* Property type + Bedrooms — side-by-side on sm+ */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="label-base">Property Type *</label>
                          <div className="relative">
                            <select
                              required
                              className="input-base w-full cursor-pointer"
                              style={{ minHeight: '52px', padding: '14px 36px 14px 16px', appearance: 'none' }}
                              value={form.propertyType}
                              onChange={e => set('propertyType')(e.target.value)}
                            >
                              <option value="" disabled>Type…</option>
                              {PROPERTY_TYPES.map(t => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                            <span
                              className="absolute right-3 top-1/2 pointer-events-none"
                              style={{ transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: '10px' }}
                            >
                              ▾
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="label-base">Bedrooms *</label>
                          <div className="relative">
                            <select
                              required
                              className="input-base w-full cursor-pointer"
                              style={{ minHeight: '52px', padding: '14px 36px 14px 16px', appearance: 'none' }}
                              value={form.bedrooms}
                              onChange={e => set('bedrooms')(e.target.value)}
                            >
                              <option value="" disabled>Beds…</option>
                              {BEDROOMS.map(b => (
                                <option key={b} value={b}>{b}</option>
                              ))}
                            </select>
                            <span
                              className="absolute right-3 top-1/2 pointer-events-none"
                              style={{ transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: '10px' }}
                            >
                              ▾
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <label className="label-base">When are you looking to sell? *</label>
                        <div className="relative">
                          <select
                            required
                            className="input-base w-full cursor-pointer"
                            style={{ minHeight: '52px', padding: '14px 36px 14px 16px', appearance: 'none' }}
                            value={form.timeline}
                            onChange={e => set('timeline')(e.target.value)}
                          >
                            <option value="" disabled>Select timeline…</option>
                            {TIMELINES.map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <span
                            className="absolute right-3 top-1/2 pointer-events-none"
                            style={{ transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: '10px' }}
                          >
                            ▾
                          </span>
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="label-base">
                          Additional Notes
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
                        <textarea
                          rows={3}
                          placeholder="Anything else you'd like us to know — size, views, features…"
                          className="input-base"
                          style={{ padding: '14px 16px', resize: 'vertical', lineHeight: 1.6 }}
                          value={form.notes}
                          onChange={e => set('notes')(e.target.value)}
                        />
                      </div>

                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="btn-primary w-full group"
                      style={{ marginTop: '24px', minHeight: '56px' }}
                    >
                      Request My Free Valuation
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
                      A member of our team will contact you within 24 hours.
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
                        marginBottom: '10px',
                      }}
                    >
                      Your enquiry is completely confidential and without obligation.
                    </p>
                    <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
                      {['Local Ibiza specialists', 'Discreet buyer network', 'Data-driven valuations'].map(s => (
                        <span
                          key={s}
                          className="type-caption flex items-center gap-1.5"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          <span style={{ color: 'var(--cta-primary-bg)', fontSize: '8px' }}>●</span>
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

      {/* ── Sticky Mobile CTA ────────────────────────────────────────────── */}
      {showStickyBar && !submitted && (
        <div
          className="md:hidden fixed bottom-0 inset-x-0 z-50"
          style={{
            backgroundColor: 'var(--bg-deep)',
            borderTop:       '1px solid var(--border-dark)',
            padding:         '12px 20px',
            paddingBottom:   'max(12px, env(safe-area-inset-bottom))',
          }}
        >
          <button
            onClick={scrollToForm}
            className="btn-primary w-full"
            style={{ minHeight: '50px' }}
          >
            Get My Free Valuation →
          </button>
        </div>
      )}
    </>
  )
}

// ─── Success State ────────────────────────────────────────────────────────────

function SuccessState() {
  return (
    <div className="py-8 text-center">
      <div
        className="mx-auto flex items-center justify-center"
        style={{
          width:           '52px',
          height:          '52px',
          backgroundColor: 'var(--cta-primary-bg)',
          marginBottom:    '24px',
        }}
      >
        <span style={{ color: 'var(--text-on-dark)', fontSize: '22px', lineHeight: 1 }}>✓</span>
      </div>

      <h3
        className="font-serif"
        style={{
          fontSize:      'clamp(1.875rem, 3vw, 2.375rem)',
          fontWeight:    500,
          color:         'var(--text-primary)',
          letterSpacing: '-0.025em',
          lineHeight:    1.1,
          marginBottom:  '14px',
        }}
      >
        Thank you.
      </h3>

      <p
        className="type-body-sm"
        style={{
          color:        'var(--text-secondary)',
          lineHeight:   1.75,
          maxWidth:     '36ch',
          margin:       '0 auto 8px',
        }}
      >
        Your enquiry has been received. A member of our team will review
        your property details and contact you within 24 hours.
      </p>

      <p
        className="type-caption"
        style={{
          color:        'var(--text-tertiary)',
          marginBottom: '32px',
        }}
      >
        Check your inbox — you will receive a confirmation shortly.
      </p>

      <div
        style={{
          paddingTop: '28px',
          borderTop:  '1px solid var(--border-muted)',
        }}
      >
        <p
          className="type-caption"
          style={{
            color:        'var(--text-secondary)',
            marginBottom: '16px',
          }}
        >
          While you wait, explore available Ibiza properties.
        </p>
        <Link href="/properties" className="btn-secondary">
          Browse Properties →
        </Link>
      </div>

      <p
        className="type-caption"
        style={{
          color:        'var(--text-tertiary)',
          marginTop:    '24px',
          marginBottom: 0,
        }}
      >
        Your information is completely confidential and will never be shared with third parties.
      </p>
    </div>
  )
}
