'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const AREAS = ['Ibiza Town', 'Santa Eulalia', 'San José', 'Santa Gertrudis', 'North Ibiza']
const TYPES = ['Villa', 'Finca', 'Apartment', 'Penthouse', 'Plot', 'Townhouse']

export default function SearchBar() {
  const router = useRouter()
  const [area, setArea] = useState('')
  const [type, setType] = useState('')
  const [budget, setBudget] = useState('')
  const [beds, setBeds] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (area) params.set('area', area.toLowerCase().replace(/\s+/g, '-'))
    if (type) params.set('type', type.toLowerCase())
    if (budget) params.set('maxPrice', budget)
    if (beds) params.set('beds', beds)
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <div
      className="relative z-20"
      style={{ backgroundColor: 'var(--bg-canvas-soft)' }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
      >
        <div
          className="grid grid-cols-2 lg:grid-cols-5 -mt-8 relative"
          style={{
            backgroundColor: 'var(--surface-primary)',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          {/* Area */}
          <div
            className="p-5 lg:p-6"
            style={{ borderRight: '1px solid var(--border-muted)' }}
          >
            <label className="label-gold">Area</label>
            <select
              value={area}
              onChange={e => setArea(e.target.value)}
              className="w-full bg-transparent text-sm font-medium appearance-none focus:outline-none cursor-pointer"
              style={{ color: 'var(--text-primary)' }}
            >
              <option value="">Any Area</option>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Type */}
          <div
            className="p-5 lg:p-6"
            style={{ borderRight: '1px solid var(--border-muted)' }}
          >
            <label className="label-gold">Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full bg-transparent text-sm font-medium appearance-none focus:outline-none cursor-pointer"
              style={{ color: 'var(--text-primary)' }}
            >
              <option value="">Any Type</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Budget */}
          <div
            className="p-5 lg:p-6"
            style={{ borderRight: '1px solid var(--border-muted)' }}
          >
            <label className="label-gold">Budget</label>
            <select
              value={budget}
              onChange={e => setBudget(e.target.value)}
              className="w-full bg-transparent text-sm font-medium appearance-none focus:outline-none cursor-pointer"
              style={{ color: 'var(--text-primary)' }}
            >
              <option value="">Any Budget</option>
              <option value="500000">Under €500k</option>
              <option value="1000000">Under €1M</option>
              <option value="2000000">Under €2M</option>
              <option value="5000000">Under €5M</option>
              <option value="10000000">€5M+</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div
            className="p-5 lg:p-6"
            style={{ borderRight: '1px solid var(--border-muted)' }}
          >
            <label className="label-gold">Bedrooms</label>
            <select
              value={beds}
              onChange={e => setBeds(e.target.value)}
              className="w-full bg-transparent text-sm font-medium appearance-none focus:outline-none cursor-pointer"
              style={{ color: 'var(--text-primary)' }}
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>{n}+ beds</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="type-btn flex items-center justify-center gap-2 group col-span-2 lg:col-span-1 transition-colors duration-200"
            style={{
              backgroundColor: 'var(--bg-deep)',
              color: 'var(--text-on-dark)',
              padding: '24px',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--cta-primary-bg)'
              ;(e.currentTarget as HTMLElement).style.color = 'var(--cta-primary-text)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-deep)'
              ;(e.currentTarget as HTMLElement).style.color = 'var(--text-on-dark)'
            }}
          >
            Search
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
