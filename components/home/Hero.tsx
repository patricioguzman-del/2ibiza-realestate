'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { BUDGET_OPTIONS, BED_OPTIONS, PROPERTY_TYPE_LABELS } from '../../lib/constants'

// ─── Data ────────────────────────────────────────────────────────────────────

const HEADLINE_WORDS = ['Ibiza', 'property,', 'found', 'privately.']

const AREAS = [
  'Ibiza', 'Santa Eulalia', 'San José',
  'San Antonio', 'San Juan',
]

const TYPES = Object.values(PROPERTY_TYPE_LABELS)

const TRUST_ITEMS = [
  'Expert market knowledge',
  'Buyer & seller guidance',
  'English, Spanish & French-speaking service',
]

// ─── Animation helpers ───────────────────────────────────────────────────────

const FADE_UP = (delay: number) => ({
  initial:    { opacity: 0, y: 14 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
})

// ─── Component ───────────────────────────────────────────────────────────────

export default function Hero() {
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)
  const [area,   setArea]   = useState('')
  const [type,   setType]   = useState('')
  const [budget, setBudget] = useState('')
  const [beds,   setBeds]   = useState('')

  // Parallax scroll tracking — RAF-throttled to avoid layout thrash
  useEffect(() => {
    let rafId: number
    const handle = () => {
      rafId = requestAnimationFrame(() => setScrollY(window.scrollY))
    }
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    return () => {
      window.removeEventListener('scroll', handle)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (area)   params.set('area',     area.toLowerCase().replace(/\s+/g, '-'))
    if (type)   params.set('type',     type.toLowerCase())
    if (budget) params.set('maxPrice', budget)
    if (beds)   params.set('beds',     beds)
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <section
      className="relative flex flex-col overflow-hidden"
      style={{ minHeight: '100dvh', backgroundColor: 'var(--bg-deep)' }}
    >

      {/* ── A. Background image — parallax ───────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&q=90&fit=crop"
          alt=""
          style={{
            position:       'absolute',
            top:            '-8%',
            left:           0,
            width:          '100%',
            height:         'calc(100% + 16%)',
            objectFit:      'cover',
            objectPosition: 'center 42%',
            transform:      `translateY(${scrollY * 0.08}px)`,
            willChange:     'transform',
          }}
          fetchPriority="high"
        />
        {/* Base wash */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(20,20,19,0.08)' }}
        />
        {/* Left directional */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(20,20,19,0.55) 0%, rgba(20,20,19,0.38) 30%, rgba(20,20,19,0.16) 55%, rgba(20,20,19,0.04) 78%)',
          }}
        />
        {/* Text-column scrim */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(20,20,19,0.18) 0%, rgba(20,20,19,0.04) 42%, transparent 58%)',
          }}
        />
        {/* Bottom vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(20,20,19,0.40) 0%, rgba(20,20,19,0.06) 28%, transparent 52%)',
          }}
        />
      </div>

      {/* ── B. Main content column ───────────────────────────────────────── */}
      <div
        className="relative z-10 flex-1 flex flex-col justify-center"
        style={{
          paddingTop:    '108px',
          paddingBottom: 'clamp(2.5rem, 5vh, 4rem)',
        }}
      >
        <div
          className="mx-auto w-full"
          style={{
            maxWidth:      'var(--content-lg)',
            paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
          }}
        >

          {/* ── Eyebrow ─────────────────────────────────────────────────── */}
          <motion.p
            {...FADE_UP(0.08)}
            className="type-eyebrow"
            style={{ color: 'var(--text-on-image-muted)', marginBottom: '22px' }}
          >
            Ibiza Real Estate
          </motion.p>

          {/* ── H1 — word-by-word masked reveal ─────────────────────────── */}
          <motion.h1
            style={{
              color:         'var(--text-on-image)',
              marginBottom:  '26px',
              fontSize:      'clamp(2.6rem, 5.5vw, 5rem)',
              lineHeight:    0.98,
              letterSpacing: '-0.03em',
              maxWidth:      '14ch',
            }}
            initial="hidden"
            animate="visible"
            variants={{
              hidden:  {},
              visible: { transition: { staggerChildren: 0.09, delayChildren: 0.18 } },
            }}
          >
            {HEADLINE_WORDS.map((word, i) => (
              <span key={i} className="word-mask">
                <motion.span
                  style={{ display: 'inline-block' }}
                  variants={{
                    hidden:  { y: '110%' },
                    visible: {
                      y:          0,
                      transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as const },
                    },
                  }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* ── Supporting text ──────────────────────────────────────────── */}
          <motion.p
            {...FADE_UP(0.56)}
            className="type-body-lg"
            style={{
              color:        'var(--text-on-image)',
              maxWidth:     '460px',
              lineHeight:   1.68,
              marginBottom: '36px',
            }}
          >
            We work with international buyers and Ibiza homeowners to find and
            sell the island&apos;s finest properties — on and off market.
          </motion.p>

          {/* ── Search panel ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: '32px', borderRadius: '12px', overflow: 'hidden', maxWidth: '720px' }}
            className="hero-search-panel"
          >
            <div className="hero-search-panel-inner" style={{ paddingInline: 0 }}>
              <HeroField label="Area" value={area} onChange={setArea}>
                <option value="">All Areas</option>
                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </HeroField>
              <div className="hero-search-panel-divider" />
              <HeroField label="Property Type" value={type} onChange={setType}>
                <option value="">Any Type</option>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </HeroField>
              <div className="hero-search-panel-divider" />
              <HeroField label="Budget" value={budget} onChange={setBudget}>
                <option value="">Any Budget</option>
                {BUDGET_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </HeroField>
              <div className="hero-search-panel-divider" />
              <HeroField label="Bedrooms" value={beds} onChange={setBeds}>
                <option value="">Any</option>
                {BED_OPTIONS.map(n => <option key={n} value={String(n)}>{n}+ beds</option>)}
              </HeroField>
              <button
                onClick={handleSearch}
                className="hero-search-panel-btn"
                aria-label="Search properties"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <circle cx="5.75" cy="5.75" r="4.25" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M9 9L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
                </svg>
                Search
              </button>
            </div>
          </motion.div>

          {/* ── Trust strip ──────────────────────────────────────────────── */}
          <motion.div
            {...FADE_UP(0.80)}
            className="flex items-center flex-wrap"
          >
            {TRUST_ITEMS.map((item, i) => (
              <span key={item} className="flex items-center">
                <span
                  style={{
                    fontFamily:    'var(--font-sans)',
                    fontSize:      '12px',
                    fontWeight:    500,
                    letterSpacing: '0.05em',
                    color:         'var(--text-on-image)',
                  }}
                >
                  {item}
                </span>
                {i < TRUST_ITEMS.length - 1 && (
                  <span
                    style={{
                      margin:     '0 10px',
                      color:      'var(--text-on-image-faint)',
                      fontSize:   '14px',
                      lineHeight: 1,
                    }}
                  >
                    ·
                  </span>
                )}
              </span>
            ))}
          </motion.div>

        </div>
      </div>


    </section>
  )
}

// ─── HeroField — inline search dropdown ──────────────────────────────────────

function HeroField({
  label, value, onChange, children,
}: {
  label:    string
  value:    string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="hero-search-panel-field">
      <span className="hero-search-panel-label">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`hero-search-panel-select${!value ? ' is-placeholder' : ''}`}
      >
        {children}
      </select>
    </div>
  )
}
