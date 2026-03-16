'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { BUDGET_OPTIONS, BED_OPTIONS, PROPERTY_TYPE_LABELS } from '../../lib/constants'

// ─── Data ───────────────────────────────────────────────────────────────────

const AREAS = [
  'Ibiza Town',
  'Santa Eulalia',
  'San José',
  'Santa Gertrudis',
  'North Ibiza',
  'Es Cubells',
]

const TYPES = Object.values(PROPERTY_TYPE_LABELS)

const TRUST = [
  '500+ curated homes',
  'Local expertise since 2015',
  'Discreet, personal service',
]

// ─── Animation helpers ───────────────────────────────────────────────────────

const FADE_UP = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
})

// ─── Component ───────────────────────────────────────────────────────────────

export default function Hero() {
  const router  = useRouter()
  const [area,   setArea]   = useState('')
  const [type,   setType]   = useState('')
  const [budget, setBudget] = useState('')
  const [beds,   setBeds]   = useState('')
  const [scrollY, setScrollY] = useState(0)

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
      style={{ minHeight: '100vh', backgroundColor: 'var(--bg-deep)' }}
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
          style={{ backgroundColor: 'rgba(47,58,55,0.10)' }}
        />

        {/* Left directional */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(47,58,55,0.65) 0%, rgba(47,58,55,0.38) 32%, rgba(47,58,55,0.08) 58%, transparent 100%)',
          }}
        />

        {/* Bottom vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(47,58,55,0.44) 0%, rgba(47,58,55,0.10) 28%, transparent 52%)',
          }}
        />
      </div>

      {/* ── B. Content column ────────────────────────────────────────────── */}
      {/*
        Layout:
          text block  (max 580px) — eyebrow → H1 → subheadline
          search block (max 860px) — search bar → trust row
        Both left-aligned, creating a deliberate stepped layout.
      */}
      <div
        className="relative z-10 flex-1 flex flex-col justify-center"
        style={{
          paddingTop:    '104px',
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

          {/* ── Text block ─────────────────────────────────────────────── */}
          <div style={{ maxWidth: '580px', marginBottom: '36px' }}>

            {/* Eyebrow */}
            <motion.p
              {...FADE_UP(0.08)}
              className="type-eyebrow"
              style={{ color: 'var(--accent-sand)', marginBottom: '18px' }}
            >
              Ibiza Real Estate
            </motion.p>

            {/* H1 — word-by-word masked reveal */}
            <motion.h1
              style={{
                color:         'var(--text-on-dark)',
                marginBottom:  '20px',
                fontSize:      'clamp(2.75rem, 5.5vw, 4.5rem)',
                lineHeight:    0.97,
                letterSpacing: '-0.03em',
              }}
              initial="hidden"
              animate="visible"
              variants={{
                hidden:  {},
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.18 } },
              }}
            >
              {['Find', 'your', 'place', 'in', 'Ibiza'].map((word) => (
                <span key={word} className="word-mask">
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

            {/* Subheadline */}
            <motion.p
              {...FADE_UP(0.50)}
              className="type-body-lg"
              style={{
                color:      'rgba(245,240,232,0.80)',
                maxWidth:   '520px',
                lineHeight: 1.65,
                marginBottom: 0,
              }}
            >
              Curated villas, fincas and apartments across Ibiza, guided by
              deep local expertise and a discreet, personal approach.
            </motion.p>

          </div>

          {/* ── Search block ───────────────────────────────────────────── */}
          <motion.div
            {...FADE_UP(0.62)}
            style={{ maxWidth: '860px' }}
          >

            {/* Search bar */}
            <div className="search-container" style={{ marginBottom: '20px' }}>

              <SearchField label="Area" value={area} onChange={setArea}>
                <option value="">All Areas</option>
                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </SearchField>

              <SearchField label="Property Type" value={type} onChange={setType}>
                <option value="">Any Type</option>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </SearchField>

              <SearchField label="Price Range" value={budget} onChange={setBudget}>
                <option value="">Any Budget</option>
                {BUDGET_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </SearchField>

              <SearchField label="Bedrooms" value={beds} onChange={setBeds}>
                <option value="">Any Beds</option>
                {BED_OPTIONS.map(n => (
                  <option key={n} value={n}>{n}+ beds</option>
                ))}
              </SearchField>

              <button onClick={handleSearch} className="search-btn">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                Search
              </button>

            </div>

            {/* Trust signals */}
            <div className="flex items-center flex-wrap">
              {TRUST.map((signal, i) => (
                <span key={signal} className="flex items-center">
                  <span
                    style={{
                      fontFamily:    'var(--font-sans)',
                      fontSize:      '11px',
                      fontWeight:    400,
                      letterSpacing: '0.05em',
                      color:         'rgba(245,240,232,0.72)',
                    }}
                  >
                    {signal}
                  </span>
                  {i < TRUST.length - 1 && (
                    <span
                      style={{
                        margin:     '0 14px',
                        color:      'rgba(245,240,232,0.45)',
                        fontSize:   '14px',
                        lineHeight: 1,
                      }}
                    >
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>

          </motion.div>

        </div>
      </div>

    </section>
  )
}

// ─── SearchField ─────────────────────────────────────────────────────────────

interface SearchFieldProps {
  label:    string
  value:    string
  onChange: (v: string) => void
  children: React.ReactNode
}

function SearchField({ label, value, onChange, children }: SearchFieldProps) {
  return (
    <div className="search-input-wrapper">
      <span className="search-field-label">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`search-field-select${!value ? ' is-placeholder' : ''}`}
      >
        {children}
      </select>
    </div>
  )
}
