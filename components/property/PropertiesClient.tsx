'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import PropertyCard from './PropertyCard'
import type { PropertyListItem, Area } from '../../types'
import { BUDGET_OPTIONS, BED_OPTIONS } from '../../lib/constants'

// ─── Types ───────────────────────────────────────────────────────────────────

type QuickFilter = 'all' | 'villa' | 'apartment' | 'seaView' | 'newDevelopment'
type SortOption  = 'newest' | 'priceAsc' | 'priceDesc'

interface PropertiesClientProps {
  initialProperties: PropertyListItem[]
  areas:             Area[]
}

// ─── Constants ───────────────────────────────────────────────────────────────

const QUICK_FILTERS: { key: QuickFilter; label: string }[] = [
  { key: 'all',            label: 'All'              },
  { key: 'villa',          label: 'Villas'           },
  { key: 'apartment',      label: 'Apartments'       },
  { key: 'seaView',        label: 'Sea View'         },
  { key: 'newDevelopment', label: 'New Developments' },
]

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'newest',   label: 'Newest first'    },
  { key: 'priceAsc', label: 'Price: low → high' },
  { key: 'priceDesc', label: 'Price: high → low' },
]

const PER_PAGE = 12

// ─── Empty State ─────────────────────────────────────────────────────────────

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

// ─── Component ───────────────────────────────────────────────────────────────

export default function PropertiesClient({ initialProperties, areas }: PropertiesClientProps) {
  const searchParams = useSearchParams()

  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all')
  const [area,        setArea]        = useState(searchParams.get('area')     || '')
  const [zone,        setZone]        = useState(searchParams.get('zone')     || '')
  const [maxPrice,    setMaxPrice]    = useState(searchParams.get('maxPrice') || '')
  const [minBeds,     setMinBeds]     = useState(searchParams.get('beds')     || '')
  const [sort,        setSort]        = useState<SortOption>('newest')
  const [page,        setPage]        = useState(1)

  // unique sorted zones, scoped to the selected area if one is chosen
  const availableZones = useMemo(() => {
    const source = area
      ? initialProperties.filter(p => p.area?.slug?.current === area)
      : initialProperties
    const set = new Set(source.map(p => p.neighborhood).filter(Boolean) as string[])
    return Array.from(set).sort()
  }, [initialProperties, area])

  // ── Filtering + sorting ───────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let result = initialProperties.filter(p => {
      if (area     && p.area?.slug?.current !== area)                  return false
      if (zone     && p.neighborhood !== zone)                         return false
      if (maxPrice && !p.priceOnRequest && (p.price ?? 0) > Number(maxPrice)) return false
      if (minBeds  && (p.beds ?? 0) < Number(minBeds))                 return false

      if (quickFilter === 'villa'          && p.propertyType !== 'villa')     return false
      if (quickFilter === 'apartment'      && p.propertyType !== 'apartment') return false
      if (quickFilter === 'seaView'        && !p.features?.some(
        (f: string) => f.toLowerCase().includes('sea view')))                 return false
      if (quickFilter === 'newDevelopment' && !p.features?.some(
        (f: string) => f.toLowerCase().includes('new development')))          return false

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
  }, [initialProperties, quickFilter, sort, area, zone, maxPrice, minBeds])

  const displayed      = filtered.slice(0, page * PER_PAGE)
  const hasAnyFilter   = quickFilter !== 'all' || area || zone || maxPrice || minBeds
  const _activeSortLabel = SORT_OPTIONS.find(s => s.key === sort)?.label ?? 'Sort'

  function clearAll() {
    setQuickFilter('all')
    setArea('')
    setZone('')
    setMaxPrice('')
    setMinBeds('')
    setPage(1)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ backgroundColor: 'var(--bg-canvas-soft)', minHeight: '100vh' }}>

      {/* ── Sticky Filter Bar ─────────────────────────────────────────────── */}
      <div
        className="sticky z-30"
        style={{ top: '104px', backgroundColor: 'var(--surface-primary)', borderBottom: '1px solid var(--border-soft)' }}
      >

        {/* Row 1 — Quick pills */}
        <div style={{ borderBottom: '1px solid var(--border-muted)', paddingBlock: '13px' }}>
          <div
            className="mx-auto flex items-center gap-2 flex-wrap"
            style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
          >
            {QUICK_FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => { setQuickFilter(f.key); setPage(1) }}
                className={quickFilter === f.key ? 'filter-pill filter-pill--active' : 'filter-pill'}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2 — Advanced selects + sort dropdown + count */}
        <div style={{ paddingBlock: '10px' }}>
          <div
            className="mx-auto flex flex-wrap items-center gap-3"
            style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
          >

            {/* Area */}
            <div className="relative">
              <select
                value={area}
                onChange={e => { setArea(e.target.value); setZone(''); setPage(1) }}
                className="input-filter cursor-pointer"
                style={{ paddingRight: '26px' }}
              >
                <option value="">All Areas</option>
                {areas.map(a => (
                  <option key={a._id} value={a.slug.current}>{a.name}</option>
                ))}
              </select>
              <span className="absolute right-2 top-1/2 pointer-events-none" style={{ transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: '9px', lineHeight: 1 }}>▾</span>
            </div>

            {/* Zone — only shown when there are zones to pick from */}
            {availableZones.length > 0 && (
              <div className="relative">
                <select
                  value={zone}
                  onChange={e => { setZone(e.target.value); setPage(1) }}
                  className="input-filter cursor-pointer"
                  style={{ paddingRight: '26px' }}
                >
                  <option value="">All Zones</option>
                  {availableZones.map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
                <span className="absolute right-2 top-1/2 pointer-events-none" style={{ transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: '9px', lineHeight: 1 }}>▾</span>
              </div>
            )}

            {/* Budget */}
            <div className="relative">
              <select
                value={maxPrice}
                onChange={e => { setMaxPrice(e.target.value); setPage(1) }}
                className="input-filter cursor-pointer"
                style={{ paddingRight: '26px' }}
              >
                <option value="">Any Budget</option>
                {BUDGET_OPTIONS.filter(o => o.value !== '10000000').map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <span className="absolute right-2 top-1/2 pointer-events-none" style={{ transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: '9px', lineHeight: 1 }}>▾</span>
            </div>

            {/* Beds */}
            <div className="relative">
              <select
                value={minBeds}
                onChange={e => { setMinBeds(e.target.value); setPage(1) }}
                className="input-filter cursor-pointer"
                style={{ paddingRight: '26px' }}
              >
                <option value="">Any Beds</option>
                {BED_OPTIONS.filter(n => n <= 5).map(n => (
                  <option key={n} value={n}>{n}+ Beds</option>
                ))}
              </select>
              <span className="absolute right-2 top-1/2 pointer-events-none" style={{ transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: '9px', lineHeight: 1 }}>▾</span>
            </div>

            {/* Clear */}
            {hasAnyFilter && (
              <button
                onClick={clearAll}
                className="type-caption"
                style={{
                  color:               'var(--text-tertiary)',
                  textDecoration:      'underline',
                  textUnderlineOffset: '2px',
                  transition:          'color var(--transition-ui)',
                  letterSpacing:       '0.04em',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--cta-primary-bg)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
              >
                Clear
              </button>
            )}

            {/* Sort dropdown — right-aligned */}
            <div className="relative ml-auto">
              <select
                value={sort}
                onChange={e => { setSort(e.target.value as SortOption); setPage(1) }}
                className="input-filter cursor-pointer"
                style={{ paddingRight: '26px', color: sort !== 'newest' ? 'var(--text-primary)' : undefined }}
              >
                {SORT_OPTIONS.map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
              <span className="absolute right-2 top-1/2 pointer-events-none" style={{ transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: '9px', lineHeight: 1 }}>▾</span>
            </div>

            {/* Count */}
            <span className="type-caption" style={{ color: 'var(--text-tertiary)' }}>
              {filtered.length} {filtered.length === 1 ? 'property' : 'properties'}
            </span>

          </div>
        </div>

      </div>

      {/* ── Property Grid ─────────────────────────────────────────────────── */}
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
                <PropertyCard key={p._id} property={p} priority={i < 3} />
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
          </>
        )}
      </div>

    </div>
  )
}
