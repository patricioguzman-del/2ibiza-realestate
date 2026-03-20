'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PropertyCard from './PropertyCard'
import type { PropertyListItem, Area } from '../../types'
import { BUDGET_OPTIONS, BED_OPTIONS } from '../../lib/constants'

// ─── Types ───────────────────────────────────────────────────────────────────

type SortOption = 'newest' | 'priceAsc' | 'priceDesc'

interface PropertiesClientProps {
  initialProperties: PropertyListItem[]
  areas:             Area[]
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PROPERTY_TYPE_OPTIONS = [
  { value: 'villa',       label: 'Villa'       },
  { value: 'apartment',   label: 'Apartment'   },
  { value: 'penthouse',   label: 'Penthouse'   },
  { value: 'finca',       label: 'Finca'       },
  { value: 'townhouse',   label: 'Townhouse'   },
]

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'newest',    label: 'Newest first'      },
  { key: 'priceAsc',  label: 'Price: low → high' },
  { key: 'priceDesc', label: 'Price: high → low' },
]

const PER_PAGE = 12

// ─── Sub-components ──────────────────────────────────────────────────────────

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div style={{ paddingBlock: '100px', textAlign: 'center' }}>
      <p
        className="font-serif"
        style={{ fontSize: '1.75rem', color: 'var(--text-tertiary)', marginBottom: '12px' }}
      >
        No properties found.
      </p>
      <p className="type-body-sm" style={{ color: 'var(--text-tertiary)', marginBottom: '28px' }}>
        Try a different filter combination.
      </p>
      <button onClick={onClear} className="btn-secondary">
        Clear all filters
      </button>
    </div>
  )
}

function OffMarketCTA() {
  return (
    <div
      style={{
        marginTop:  'clamp(3.5rem, 7vw, 5.5rem)',
        paddingTop: 'clamp(3rem, 5vw, 4.5rem)',
        borderTop:  '1px solid var(--border-muted)',
        textAlign:  'center',
      }}
    >
      <div className="eyebrow-row mb-[10px]" style={{ justifyContent: 'center' }}>
        <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>
          Off-Market Properties
        </span>
      </div>

      <h2
        className="font-serif"
        style={{
          color:         'var(--text-primary)',
          fontSize:      'clamp(1.75rem, 2.8vw, 2.375rem)',
          fontWeight:    500,
          lineHeight:    1.12,
          letterSpacing: '-0.022em',
          marginBottom:  '18px',
        }}
      >
        Not finding what<br className="hidden sm:block" /> you&apos;re looking for?
      </h2>

      <p
        className="type-body"
        style={{
          color:      'var(--text-secondary)',
          lineHeight: 1.72,
          maxWidth:   '52ch',
          margin:     '0 auto 36px',
        }}
      >
        We maintain a private register of unlisted Ibiza properties — villas, fincas
        and estates that never appear on the open market. Speak to an advisor and
        tell us what you&apos;re looking for.
      </p>

      <Link href="/contact" className="btn-primary">
        Speak to an Advisor
      </Link>
    </div>
  )
}

// ─── FilterField — editorial underline select ─────────────────────────────────

function FilterField({
  label,
  value,
  onChange,
  placeholder,
  children,
  first,
}: {
  label:       string
  value:       string
  onChange:    (v: string) => void
  placeholder: string
  children:    React.ReactNode
  first?:      boolean
}) {
  return (
    <div
      className="filter-field"
      style={{
        display:       'flex',
        flexDirection: 'column',
        justifyContent:'center',
        padding:       first ? '0 24px 0 0' : '0 24px',
        flex:          '1 1 0',
        minWidth:      0,
        cursor:        'pointer',
      }}
    >
      <span
        style={{
          display:       'block',
          fontFamily:    'var(--font-sans)',
          fontSize:      '10px',
          fontWeight:    500,
          letterSpacing: '0.13em',
          textTransform: 'uppercase',
          color:         'var(--text-tertiary)',
          marginBottom:  '4px',
          pointerEvents: 'none',
          lineHeight:    1,
        }}
      >
        {label}
      </span>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            appearance:       'none',
            WebkitAppearance: 'none',
            background:       'transparent',
            border:           'none',
            padding:          '0 18px 0 0',
            fontFamily:       'var(--font-sans)',
            fontSize:         '13px',
            fontWeight:       500,
            letterSpacing:    '0.01em',
            color:            value ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor:           'pointer',
            outline:          'none',
            width:            '100%',
            lineHeight:       1.4,
          }}
        >
          <option value="">{placeholder}</option>
          {children}
        </select>
        <span
          style={{
            position:      'absolute',
            right:         0,
            top:           '50%',
            transform:     'translateY(-50%)',
            pointerEvents: 'none',
            color:         'var(--text-tertiary)',
            fontSize:      '9px',
            lineHeight:    1,
          }}
        >
          ▾
        </span>
      </div>
    </div>
  )
}

// Thin vertical divider between fields
function FieldDivider() {
  return (
    <div
      aria-hidden="true"
      style={{
        width:           '1px',
        backgroundColor: 'var(--border-muted)',
        alignSelf:       'stretch',
        flexShrink:      0,
        margin:          '14px 0',
      }}
    />
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PropertiesClient({ initialProperties, areas }: PropertiesClientProps) {
  const searchParams = useSearchParams()

  const [propertyType,     setPropertyType]     = useState(searchParams.get('type')     || '')
  const [area,             setArea]             = useState(searchParams.get('area')     || '')
  const [neighbourhood,    setNeighbourhood]    = useState(searchParams.get('zone')     || '')
  const [maxPrice,         setMaxPrice]         = useState(searchParams.get('maxPrice') || '')
  const [minBeds,          setMinBeds]          = useState(searchParams.get('beds')     || '')
  const [sort,             setSort]             = useState<SortOption>('newest')
  const [page,             setPage]             = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileFiltersOpen])

  // Unique sorted neighbourhoods within the selected area
  const availableNeighbourhoods = useMemo(() => {
    const source = area
      ? initialProperties.filter(p => p.area?.slug?.current === area)
      : initialProperties
    const set = new Set(source.map(p => p.neighborhood).filter(Boolean) as string[])
    return Array.from(set).sort()
  }, [initialProperties, area])

  // ── Filtering + sorting ─────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let result = initialProperties.filter(p => {
      if (propertyType  && p.propertyType !== propertyType)                        return false
      if (area          && p.area?.slug?.current !== area)                         return false
      if (neighbourhood && p.neighborhood !== neighbourhood)                       return false
      if (maxPrice      && !p.priceOnRequest && (p.price ?? 0) > Number(maxPrice)) return false
      if (minBeds       && (p.beds ?? 0) < Number(minBeds))                        return false
      return true
    })

    if (sort === 'priceAsc') {
      result = [...result].sort((a, b) => {
        if (a.priceOnRequest && b.priceOnRequest) return 0
        if (a.priceOnRequest) return 1
        if (b.priceOnRequest) return -1
        return (a.price ?? 0) - (b.price ?? 0)
      })
    } else if (sort === 'priceDesc') {
      result = [...result].sort((a, b) => {
        if (a.priceOnRequest && b.priceOnRequest) return 0
        if (a.priceOnRequest) return 1
        if (b.priceOnRequest) return -1
        return (b.price ?? 0) - (a.price ?? 0)
      })
    }

    return result
  }, [initialProperties, propertyType, sort, area, neighbourhood, maxPrice, minBeds])

  const displayed          = filtered.slice(0, page * PER_PAGE)
  const hasAnyFilter       = !!(propertyType || area || neighbourhood || maxPrice || minBeds)
  const activeFilterCount  = [propertyType, area, neighbourhood, maxPrice, minBeds].filter(Boolean).length

  function clearAll() {
    setPropertyType('')
    setArea('')
    setNeighbourhood('')
    setMaxPrice('')
    setMinBeds('')
    setPage(1)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ backgroundColor: 'var(--bg-canvas-soft)', minHeight: '100vh' }}>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* DESKTOP FILTER BAR (md+) — single editorial row                    */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div
        className="hidden md:block"
        style={{
          backgroundColor: 'var(--surface-primary)',
          borderTop:       '1px solid var(--border-muted)',
          borderBottom:    '1px solid var(--border-muted)',
        }}
      >
        <div
          className="mx-auto flex items-stretch"
          style={{
            maxWidth:      'var(--content-lg)',
            paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
            height:        '64px',
          }}
        >
          {/* Area */}
          <FilterField
            label="Area"
            value={area}
            onChange={v => { setArea(v); setNeighbourhood(''); setPage(1) }}
            placeholder="All Areas"
            first
          >
            {areas.map(a => (
              <option key={a._id} value={a.slug.current}>{a.name}</option>
            ))}
          </FilterField>

          <FieldDivider />

          {/* Neighbourhood — only when area selected */}
          {area && availableNeighbourhoods.length > 0 && (
            <>
              <FilterField
                label="Neighbourhood"
                value={neighbourhood}
                onChange={v => { setNeighbourhood(v); setPage(1) }}
                placeholder="All Neighbourhoods"
              >
                {availableNeighbourhoods.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </FilterField>
              <FieldDivider />
            </>
          )}

          {/* Type */}
          <FilterField
            label="Type"
            value={propertyType}
            onChange={v => { setPropertyType(v); setPage(1) }}
            placeholder="Any Type"
          >
            {PROPERTY_TYPE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </FilterField>

          <FieldDivider />

          {/* Budget */}
          <FilterField
            label="Budget"
            value={maxPrice}
            onChange={v => { setMaxPrice(v); setPage(1) }}
            placeholder="Any Budget"
          >
            {BUDGET_OPTIONS.filter(o => o.value !== '10000000').map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </FilterField>

          <FieldDivider />

          {/* Beds */}
          <FilterField
            label="Bedrooms"
            value={minBeds}
            onChange={v => { setMinBeds(v); setPage(1) }}
            placeholder="Any"
          >
            {BED_OPTIONS.filter(n => n <= 5).map(n => (
              <option key={n} value={n}>{n}+ Beds</option>
            ))}
          </FilterField>

          {/* Clear — only when filters active */}
          {hasAnyFilter && (
            <>
              <FieldDivider />
              <button
                onClick={clearAll}
                style={{
                  padding:       '0 20px',
                  display:       'flex',
                  alignItems:    'center',
                  gap:           '5px',
                  fontFamily:    'var(--font-sans)',
                  fontSize:      '11px',
                  fontWeight:    500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color:         'var(--text-tertiary)',
                  backgroundColor: 'transparent',
                  border:        'none',
                  cursor:        'pointer',
                  whiteSpace:    'nowrap',
                  flexShrink:    0,
                  transition:    'color var(--transition-ui)',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--cta-primary-bg)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
              >
                <span aria-hidden="true" style={{ fontSize: '13px', lineHeight: 1 }}>×</span>
                Clear
              </button>
            </>
          )}

          {/* Sort + count — right-aligned */}
          <div className="flex items-stretch ml-auto">
            <FieldDivider />
            <FilterField
              label="Sort"
              value={sort}
              onChange={v => { setSort(v as SortOption); setPage(1) }}
              placeholder=""
            >
              {SORT_OPTIONS.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </FilterField>

            <FieldDivider />

            {/* Count */}
            <div
              style={{
                display:       'flex',
                flexDirection: 'column',
                justifyContent:'center',
                padding:       '0 0 0 24px',
                flexShrink:    0,
              }}
            >
              <span
                style={{
                  fontFamily:    'var(--font-sans)',
                  fontSize:      '10px',
                  fontWeight:    500,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  color:         'var(--text-tertiary)',
                  display:       'block',
                  marginBottom:  '4px',
                  lineHeight:    1,
                }}
              >
                Results
              </span>
              <span
                style={{
                  fontFamily:    'var(--font-sans)',
                  fontSize:      '13px',
                  fontWeight:    500,
                  color:         'var(--text-primary)',
                  lineHeight:    1.4,
                  whiteSpace:    'nowrap',
                }}
              >
                {filtered.length} {filtered.length === 1 ? 'property' : 'properties'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MOBILE FILTER BAR (< md)                                           */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div
        className="md:hidden"
        style={{
          backgroundColor: 'var(--surface-primary)',
          borderTop:       '1px solid var(--border-muted)',
          borderBottom:    '1px solid var(--border-muted)',
        }}
      >
        <div
          className="flex items-center gap-3"
          style={{ paddingInline: '1.25rem', height: '52px' }}
        >
          {/* Sort */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <select
              value={sort}
              onChange={e => { setSort(e.target.value as SortOption); setPage(1) }}
              style={{
                appearance:       'none',
                WebkitAppearance: 'none',
                background:       'transparent',
                border:           'none',
                padding:          '0 16px 0 0',
                fontFamily:       'var(--font-sans)',
                fontSize:         '12px',
                fontWeight:       500,
                letterSpacing:    '0.03em',
                color:            'var(--text-secondary)',
                cursor:           'pointer',
                outline:          'none',
              }}
            >
              {SORT_OPTIONS.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
            <span
              style={{
                position:      'absolute',
                right:         0,
                top:           '50%',
                transform:     'translateY(-50%)',
                pointerEvents: 'none',
                color:         'var(--text-tertiary)',
                fontSize:      '9px',
              }}
            >
              ▾
            </span>
          </div>

          {/* Count */}
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize:   '12px',
              color:      'var(--text-tertiary)',
              whiteSpace: 'nowrap',
            }}
          >
            {filtered.length} {filtered.length === 1 ? 'property' : 'properties'}
          </span>

          {/* Filters button — right-aligned */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            style={{
              marginLeft:      'auto',
              display:         'flex',
              alignItems:      'center',
              gap:             '7px',
              fontFamily:      'var(--font-sans)',
              fontSize:        '11px',
              fontWeight:      500,
              letterSpacing:   '0.10em',
              textTransform:   'uppercase',
              color:           activeFilterCount > 0 ? 'var(--cta-primary-bg)' : 'var(--text-primary)',
              backgroundColor: 'transparent',
              border:          `1px solid ${activeFilterCount > 0 ? 'var(--cta-primary-bg)' : 'var(--border-soft)'}`,
              padding:         '6px 14px',
              cursor:          'pointer',
              whiteSpace:      'nowrap',
              transition:      'all var(--transition-ui)',
              flexShrink:      0,
            }}
          >
            <svg width="13" height="11" viewBox="0 0 13 11" fill="none" aria-hidden="true">
              <line x1="0" y1="2" x2="13" y2="2" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="0" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="1.2"/>
              <circle cx="4" cy="2" r="1.8" fill="var(--bg-canvas)" stroke="currentColor" strokeWidth="1.2"/>
              <circle cx="9" cy="9" r="1.8" fill="var(--bg-canvas)" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span
                style={{
                  display:         'inline-flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  width:           '17px',
                  height:          '17px',
                  backgroundColor: 'var(--cta-primary-bg)',
                  color:           '#fff',
                  fontSize:        '10px',
                  fontWeight:      600,
                  lineHeight:      1,
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MOBILE FILTER DRAWER                                               */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        onClick={() => setMobileFiltersOpen(false)}
        style={{
          position:        'fixed',
          inset:           0,
          zIndex:          40,
          backgroundColor: 'rgba(47,58,55,0.55)',
          backdropFilter:  'blur(3px)',
          opacity:         mobileFiltersOpen ? 1 : 0,
          pointerEvents:   mobileFiltersOpen ? 'auto' : 'none',
          transition:      'opacity 280ms ease',
        }}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-label="Filter properties"
        aria-modal="true"
        style={{
          position:        'fixed',
          left:            0,
          right:           0,
          bottom:          0,
          zIndex:          50,
          backgroundColor: 'var(--bg-canvas-soft)',
          borderTop:       '2px solid var(--cta-primary-bg)',
          padding:         'clamp(1.5rem, 5vw, 2rem)',
          transform:       mobileFiltersOpen ? 'translateY(0)' : 'translateY(100%)',
          transition:      'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
          maxHeight:       '90dvh',
          overflowY:       'auto',
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: '28px' }}>
          <p
            style={{
              fontFamily:    'var(--font-sans)',
              fontSize:      '13px',
              fontWeight:    500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color:         'var(--text-primary)',
              margin:        0,
            }}
          >
            Filters
          </p>
          <button
            onClick={() => setMobileFiltersOpen(false)}
            style={{
              fontSize:        '20px',
              color:           'var(--text-secondary)',
              backgroundColor: 'transparent',
              border:          'none',
              cursor:          'pointer',
              lineHeight:      1,
              padding:         '4px',
            }}
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {['Area', 'Type', 'Budget', 'Bedrooms'].map((lbl) => {
            const isArea     = lbl === 'Area'
            const isType     = lbl === 'Type'
            const isBudget   = lbl === 'Budget'
            const isBedrooms = lbl === 'Bedrooms'
            const val = isArea ? area : isType ? propertyType : isBudget ? maxPrice : minBeds

            const handleChange = (v: string) => {
              if (isArea)     { setArea(v); setNeighbourhood('') }
              if (isType)     setPropertyType(v)
              if (isBudget)   setMaxPrice(v)
              if (isBedrooms) setMinBeds(v)
              setPage(1)
            }

            return (
              <label key={lbl} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span
                  style={{
                    fontFamily:    'var(--font-sans)',
                    fontSize:      '10px',
                    fontWeight:    500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color:         'var(--text-tertiary)',
                  }}
                >
                  {lbl}
                </span>
                <div
                  style={{
                    position:    'relative',
                    borderBottom: '1px solid var(--border-muted)',
                    paddingBottom: '8px',
                  }}
                >
                  <select
                    value={val}
                    onChange={e => handleChange(e.target.value)}
                    style={{
                      appearance:       'none',
                      WebkitAppearance: 'none',
                      background:       'transparent',
                      border:           'none',
                      padding:          '0 20px 0 0',
                      fontFamily:       'var(--font-sans)',
                      fontSize:         '14px',
                      fontWeight:       500,
                      color:            val ? 'var(--text-primary)' : 'var(--text-secondary)',
                      cursor:           'pointer',
                      outline:          'none',
                      width:            '100%',
                    }}
                  >
                    <option value="">
                      {isArea ? 'All Areas' : isType ? 'Any Type' : isBudget ? 'Any Budget' : 'Any'}
                    </option>
                    {isArea && areas.map(a => (
                      <option key={a._id} value={a.slug.current}>{a.name}</option>
                    ))}
                    {isType && PROPERTY_TYPE_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                    {isBudget && BUDGET_OPTIONS.filter(o => o.value !== '10000000').map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                    {isBedrooms && BED_OPTIONS.filter(n => n <= 5).map(n => (
                      <option key={n} value={n}>{n}+ Beds</option>
                    ))}
                  </select>
                  <span
                    style={{
                      position:      'absolute',
                      right:         0,
                      top:           '50%',
                      transform:     'translateY(-50%)',
                      pointerEvents: 'none',
                      color:         'var(--text-tertiary)',
                      fontSize:      '9px',
                    }}
                  >
                    ▾
                  </span>
                </div>
              </label>
            )
          })}

          {/* Neighbourhood — only when area is selected */}
          {area && availableNeighbourhoods.length > 0 && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span
                style={{
                  fontFamily:    'var(--font-sans)',
                  fontSize:      '10px',
                  fontWeight:    500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color:         'var(--text-tertiary)',
                }}
              >
                Neighbourhood
              </span>
              <div
                style={{
                  position:      'relative',
                  borderBottom:  '1px solid var(--border-muted)',
                  paddingBottom: '8px',
                }}
              >
                <select
                  value={neighbourhood}
                  onChange={e => { setNeighbourhood(e.target.value); setPage(1) }}
                  style={{
                    appearance:       'none',
                    WebkitAppearance: 'none',
                    background:       'transparent',
                    border:           'none',
                    padding:          '0 20px 0 0',
                    fontFamily:       'var(--font-sans)',
                    fontSize:         '14px',
                    fontWeight:       500,
                    color:            neighbourhood ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor:           'pointer',
                    outline:          'none',
                    width:            '100%',
                  }}
                >
                  <option value="">All Neighbourhoods</option>
                  {availableNeighbourhoods.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span
                  style={{
                    position:      'absolute',
                    right:         0,
                    top:           '50%',
                    transform:     'translateY(-50%)',
                    pointerEvents: 'none',
                    color:         'var(--text-tertiary)',
                    fontSize:      '9px',
                  }}
                >
                  ▾
                </span>
              </div>
            </label>
          )}

        </div>

        {/* Actions */}
        <div
          className="flex items-center gap-4"
          style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-muted)' }}
        >
          <button
            onClick={() => setMobileFiltersOpen(false)}
            className="btn-primary"
            style={{ flex: 1 }}
          >
            Show {filtered.length} {filtered.length === 1 ? 'property' : 'properties'}
          </button>

          {hasAnyFilter && (
            <button
              onClick={() => { clearAll(); setMobileFiltersOpen(false) }}
              style={{
                fontFamily:      'var(--font-sans)',
                fontSize:        '11px',
                fontWeight:      500,
                letterSpacing:   '0.08em',
                textTransform:   'uppercase',
                color:           'var(--text-tertiary)',
                textDecoration:  'underline',
                textUnderlineOffset: '2px',
                whiteSpace:      'nowrap',
                backgroundColor: 'transparent',
                border:          'none',
                cursor:          'pointer',
                flexShrink:      0,
              }}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Property Grid ──────────────────────────────────────────────────── */}
      <div
        className="mx-auto"
        style={{
          maxWidth:      'var(--content-lg)',
          paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
          paddingBlock:  'clamp(2rem, 3vw, 3rem)',
        }}
      >
        {filtered.length === 0 ? (
          <EmptyState onClear={clearAll} />
        ) : (
          <>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              style={{ rowGap: '40px', columnGap: '32px' }}
            >
              {displayed.map((p, i) => (
                <PropertyCard key={p._id} property={p} priority={i < 3} index={i} />
              ))}
            </div>

            {displayed.length < filtered.length && (
              <div className="flex justify-center" style={{ marginTop: '56px' }}>
                <button
                  onClick={() => setPage(pg => pg + 1)}
                  className="btn-secondary"
                >
                  Load More — {filtered.length - displayed.length} remaining
                </button>
              </div>
            )}

            <OffMarketCTA />
          </>
        )}
      </div>

    </div>
  )
}
