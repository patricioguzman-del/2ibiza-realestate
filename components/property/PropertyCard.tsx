import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '../../sanity/lib/image'
import type { PropertyListItem } from '../../types'
import { PROPERTY_TYPE_LABELS } from '../../lib/constants'

const BLUR_DARK = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 4 3\'%3E%3Crect fill=\'%232F3A37\' width=\'4\' height=\'3\'/%3E%3C/svg%3E'

interface PropertyCardProps {
  property: PropertyListItem
  priority?: boolean
}

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

export default function PropertyCard({ property, priority }: PropertyCardProps) {
  const imageUrl = property.heroImage
    ? urlFor(property.heroImage).width(960).height(720).fit('crop').url()
    : 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&h=600&fit=crop'

  const attrs   = buildAttrs(property)
  const typeLbl = typeLabel(property.propertyType)

  return (
    <Link
      href={`/properties/${property.slug.current}`}
      className="group block no-underline property-card-hover"
      style={{
        backgroundColor: 'var(--surface-primary)',
        border:          '1px solid var(--border-muted)',
      }}
    >
      {/* ── Image ──────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '4 / 3', backgroundColor: 'var(--bg-deep)' }}
      >
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
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
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
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
          {property.hasTouristLicense && (
            <span
              className="type-caption"
              style={{
                backgroundColor:     'rgba(47,58,55,0.52)',
                backdropFilter:      'blur(6px)',
                WebkitBackdropFilter:'blur(6px)',
                border:              '1px solid rgba(245,240,232,0.25)',
                color:               'var(--text-on-dark)',
                padding:             '4px 10px',
                letterSpacing:       '0.12em',
                textTransform:       'uppercase',
                whiteSpace:          'nowrap',
              }}
            >
              Tourist Lic.
            </span>
          )}
        </div>

        {/* Property type badge — right */}
        {typeLbl && (
          <div
            className="absolute top-4 right-4 z-10"
            style={{
              fontFamily:          'var(--font-sans)',
              fontSize:            '10px',
              fontWeight:          500,
              letterSpacing:       '0.13em',
              textTransform:       'uppercase',
              color:               'rgba(245,240,232,0.92)',
              backgroundColor:     'rgba(47,58,55,0.52)',
              backdropFilter:      'blur(6px)',
              WebkitBackdropFilter:'blur(6px)',
              padding:             '4px 9px',
            }}
          >
            {typeLbl}
          </div>
        )}
      </div>

      {/* ── Info block ─────────────────────────────────────────────── */}
      <div style={{ padding: '20px 24px 24px' }}>

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
  )
}
