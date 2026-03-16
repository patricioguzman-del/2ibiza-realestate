'use client'

import { useState } from 'react'
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

// ─── Component ───────────────────────────────────────────────────────────────

export default function PropertySearch() {
  const router = useRouter()
  const [area,   setArea]   = useState('')
  const [type,   setType]   = useState('')
  const [budget, setBudget] = useState('')
  const [beds,   setBeds]   = useState('')

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
      style={{
        backgroundColor: 'var(--bg-section-muted)',
        paddingBlock:    'clamp(3.5rem, 6vw, 5.5rem)',
      }}
    >
      <div
        className="mx-auto w-full"
        style={{
          maxWidth:      'var(--content-lg)',
          paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
        }}
      >

        {/* Section header */}
        <div style={{ marginBottom: '32px' }}>
          <p
            className="type-eyebrow"
            style={{ color: 'var(--cta-primary-bg)', marginBottom: '10px' }}
          >
            Find a Property
          </p>
          <h2
            style={{
              fontFamily:    'var(--font-serif)',
              fontSize:      'clamp(1.6rem, 3vw, 2.25rem)',
              fontWeight:    500,
              letterSpacing: '-0.02em',
              color:         'var(--text-primary)',
              lineHeight:    1.1,
              marginBottom:  '10px',
            }}
          >
            Search Ibiza Properties
          </h2>
          <p
            style={{
              fontFamily:  'var(--font-sans)',
              fontSize:    '15px',
              fontWeight:  400,
              lineHeight:  1.6,
              color:       'var(--text-secondary)',
              maxWidth:    '480px',
            }}
          >
            Explore villas, fincas, apartments, and investment opportunities across Ibiza.
          </p>
        </div>

        {/* Search bar */}
        <div className="search-container">

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
