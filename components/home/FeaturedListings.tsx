import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '../../sanity/lib/image'
import type { PropertyListItem } from '../../types'
import { PROPERTY_TYPE_LABELS } from '../../lib/constants'

const BLUR_DARK = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 4 3\'%3E%3Crect fill=\'%232F3A37\' width=\'4\' height=\'3\'/%3E%3C/svg%3E'

interface FeaturedListingsProps {
  properties: PropertyListItem[]
}

// ─── Fallback data ────────────────────────────────────────────────────────────

const FALLBACK: PropertyListItem[] = [
  {
    _id:          '1',
    title:        'Villa Aura',
    slug:         { current: 'villa-aura' },
    status:       'available',
    exclusive:    true,
    price:        4200000,
    propertyType: 'villa',
    beds:         5,
    baths:        4,
    sqm:          480,
    area:         { name: 'Santa Eulalia' },
    neighborhood: 'Roca Llisa',
    heroImage:    null,
  },
  {
    _id:          '2',
    title:        'Finca Can Blanc',
    slug:         { current: 'finca-can-blanc' },
    status:       'available',
    price:        2800000,
    propertyType: 'finca',
    beds:         4,
    baths:        3,
    sqm:          320,
    area:         { name: 'San José' },
    neighborhood: 'Cala Jondal',
    heroImage:    null,
  },
  {
    _id:          '3',
    title:        'Penthouse Marina',
    slug:         { current: 'penthouse-marina' },
    status:       'under-offer',
    price:        1950000,
    propertyType: 'penthouse',
    beds:         3,
    baths:        2,
    sqm:          210,
    area:         { name: 'Ibiza Town' },
    neighborhood: 'Marina Botafoch',
    heroImage:    null,
  },
]

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price?: number, priceOnRequest?: boolean): string {
  if (priceOnRequest || !price) return 'Price on Request'
  if (price >= 1_000_000) {
    const val = price / 1_000_000
    return `€${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}M`
  }
  return `€${(price / 1000).toFixed(0)}K`
}

function buildAttrs(p: PropertyListItem): string {
  const parts: string[] = []
  if (p.beds)    parts.push(`${p.beds} beds`)
  if (p.baths)   parts.push(`${p.baths} baths`)
  if (p.sqm)     parts.push(`${Number(p.sqm).toLocaleString()} m²`)
  if (p.plotSqm) parts.push(`${Number(p.plotSqm).toLocaleString()} m² plot`)
  return parts.join(' · ')
}

function typeLabel(type?: string): string {
  if (!type) return ''
  return PROPERTY_TYPE_LABELS[type] ?? type.charAt(0).toUpperCase() + type.slice(1)
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FeaturedListings({ properties }: FeaturedListingsProps) {
  const display = (properties?.length ? properties : FALLBACK).slice(0, 3)

  return (
    <section
      className="section-major"
      style={{ backgroundColor: 'var(--bg-canvas-soft)' }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth:      'var(--content-lg)',
          paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
        }}
      >

        {/* ── Section header — stripped of the eyebrow formula ──────────── */}
        {/* h2 stands alone; "View All" lives right-aligned in the same row */}
        <div
          className="flex items-end justify-between gap-6 flex-wrap"
          style={{ marginBottom: 'clamp(2.5rem, 4.5vw, 3.5rem)' }}
        >
          <h2 style={{ color: 'var(--text-primary)', marginBottom: 0 }}>
            Featured Properties
          </h2>
          <Link href="/properties" className="section-more-link shrink-0">
            View All Properties
            <span className="block h-px bg-current" style={{ width: '24px' }} />
          </Link>
        </div>

        {/* ── Property grid — 3 / 2 / 1 columns ───────────────────────── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ rowGap: '40px', columnGap: '32px' }}
        >
          {display.map((property, i) => {
            const imgUrl = property.heroImage
              ? urlFor(property.heroImage).width(960).height(720).fit('crop').url()
              : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]

            const attrs   = buildAttrs(property)
            const typeLbl = typeLabel(property.propertyType)

            return (
              <div key={property._id}>
                <Link
                  href={`/properties/${property.slug.current}`}
                  className="group block no-underline property-card-hover"
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    border:          '1px solid var(--border-muted)',
                  }}
                >

                  {/* ── Image ─────────────────────────────────────────── */}
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: '4 / 3', backgroundColor: 'var(--bg-deep)' }}
                  >
                    <Image
                      src={imgUrl}
                      alt={property.title}
                      fill
                      priority={i === 0}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      placeholder="blur"
                      blurDataURL={BLUR_DARK}
                      className="object-cover object-[center_38%] transition-transform duration-200 ease-out group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to bottom, transparent 60%, rgba(47,58,55,0.08) 100%)',
                      }}
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out"
                      style={{ backgroundColor: 'rgba(47,58,55,0.12)' }}
                    />

                    {/* Status / exclusive badges — left */}
                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                      {property.exclusive && (
                        <span
                          className="type-caption"
                          style={{
                            backgroundColor: 'var(--cta-primary-bg)',
                            color:           'var(--cta-primary-text)',
                            padding:         '4px 10px',
                            letterSpacing:   '0.12em',
                            textTransform:   'uppercase',
                          }}
                        >
                          Exclusive
                        </span>
                      )}
                      {property.status === 'under-offer' && (
                        <span
                          className="type-caption"
                          style={{
                            backgroundColor: 'var(--accent-sea)',
                            color:           'var(--text-on-dark)',
                            padding:         '4px 10px',
                            letterSpacing:   '0.12em',
                            textTransform:   'uppercase',
                          }}
                        >
                          Under Offer
                        </span>
                      )}
                    </div>

                    {/* Property type badge — right */}
                    {typeLbl && (
                      <div
                        className="absolute top-4 right-4 z-10"
                        style={{
                          fontFamily:      'var(--font-sans)',
                          fontSize:        '10px',
                          fontWeight:      500,
                          letterSpacing:   '0.13em',
                          textTransform:   'uppercase',
                          color:           'rgba(245,240,232,0.92)',
                          backgroundColor: 'rgba(47,58,55,0.52)',
                          backdropFilter:  'blur(6px)',
                          WebkitBackdropFilter: 'blur(6px)',
                          padding:         '4px 9px',
                        }}
                      >
                        {typeLbl}
                      </div>
                    )}
                  </div>

                  {/* ── Info block ────────────────────────────────────── */}
                  <div style={{ padding: '20px 24px 24px' }}>

                    {/* Location — accent-stone, not terracotta */}
                    {property.area && (
                      <p
                        className="type-eyebrow"
                        style={{
                          color:         'var(--accent-stone)',
                          letterSpacing: '0.16em',
                          marginBottom:  '7px',
                        }}
                      >
                        {property.area.name}
                        {property.neighborhood && (
                          <>
                            <span style={{ opacity: 0.4, margin: '0 6px' }}>·</span>
                            <span style={{ opacity: 0.72 }}>{property.neighborhood}</span>
                          </>
                        )}
                      </p>
                    )}

                    <h3
                      className="font-serif heading-hover-sea"
                      style={{
                        fontSize:      '1.25rem',
                        fontWeight:    500,
                        color:         'var(--text-primary)',
                        lineHeight:    1.22,
                        letterSpacing: '-0.015em',
                        marginBottom:  '12px',
                      }}
                    >
                      {property.title}
                    </h3>

                    {attrs && (
                      <p
                        className="type-body-sm"
                        style={{
                          color:         'var(--text-secondary)',
                          marginBottom:  0,
                          letterSpacing: '0.01em',
                        }}
                      >
                        {attrs}
                      </p>
                    )}

                    <div
                      style={{
                        height:          '1px',
                        backgroundColor: 'var(--border-muted)',
                        margin:          '18px 0',
                      }}
                    />

                    {/* Price — text-primary; CTA arrow is the terracotta element */}
                    <div className="flex items-center justify-between">
                      <span
                        style={{
                          fontFamily:    'var(--font-sans)',
                          fontSize:      '1.25rem',
                          fontWeight:    600,
                          color:         'var(--text-primary)',
                          letterSpacing: '-0.01em',
                          lineHeight:    1,
                        }}
                      >
                        {formatPrice(property.price, property.priceOnRequest)}
                      </span>

                      <span
                        className="flex items-center gap-1 type-btn transition-transform duration-200 group-hover:translate-x-1"
                        style={{ color: 'var(--cta-primary-bg)' }}
                      >
                        View
                        <span style={{ fontSize: '13px' }}>→</span>
                      </span>
                    </div>

                  </div>
                </Link>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
