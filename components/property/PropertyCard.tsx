import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '../../sanity/lib/image'
import type { PropertyListItem } from '../../types'
import { PROPERTY_TYPE_LABELS } from '../../lib/constants'

const BLUR_DARK = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 4 3\'%3E%3Crect fill=\'%232F3A37\' width=\'4\' height=\'3\'/%3E%3C/svg%3E'

// Six varied luxury property fallbacks — rotated by card index
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&h=600&fit=crop',
]

interface PropertyCardProps {
  property:  PropertyListItem
  priority?: boolean
  index?:    number
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

export default function PropertyCard({ property, priority, index = 0 }: PropertyCardProps) {
  const imageUrl = property.heroImage
    ? urlFor(property.heroImage).width(960).height(720).fit('crop').url()
    : FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]

  const attrs   = buildAttrs(property)
  const typeLbl = typeLabel(property.propertyType)

  return (
    <Link
      href={`/properties/${property.slug.current}`}
      className="group no-underline property-card-hover"
      style={{
        backgroundColor: 'var(--surface-primary)',
        border:          '1px solid var(--border-muted)',
        display:         'flex',
        flexDirection:   'column',
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

        {/* ── Left badges — max 2: Exclusive first, then Under Offer ── */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
          {property.exclusive && (
            <span className="badge badge-exclusive">Exclusive</span>
          )}
          {property.status === 'under-offer' && (
            <span className="badge badge-offered">Under Offer</span>
          )}
        </div>

        {/* ── Property type badge — right ────────────────────────── */}
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
      <div style={{ padding: '20px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {(property.neighborhood || property.area) && (
          <p
            className="type-eyebrow"
            style={{
              color:         'var(--accent-stone)',
              letterSpacing: '0.16em',
              marginBottom:  '7px',
            }}
          >
            {/* Neighbourhood is primary; area is the muted secondary context */}
            {property.neighborhood ?? property.area?.name}
            {property.neighborhood && property.area && (
              <>
                <span style={{ opacity: 0.3, margin: '0 6px' }}>·</span>
                <span style={{ opacity: 0.48, letterSpacing: '0.10em' }}>{property.area.name}</span>
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

        {/* Tourist licence — inline attribute, not a badge */}
        {property.hasTouristLicense && (
          <p
            className="type-caption"
            style={{
              color:         'var(--accent-sea)',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              marginTop:     '8px',
              marginBottom:  0,
              display:       'flex',
              alignItems:    'center',
              gap:           '5px',
            }}
          >
            <span
              style={{
                display:         'inline-block',
                width:           '5px',
                height:          '5px',
                borderRadius:    '50%',
                backgroundColor: 'currentColor',
                flexShrink:      0,
              }}
            />
            Tourist Licence
          </p>
        )}

        {/* ── Price row — pinned to bottom of card ────────────────── */}
        <div style={{ marginTop: 'auto' }}>
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
              className="flex items-center gap-1.5 type-btn transition-transform duration-200 group-hover:translate-x-1"
              style={{ color: 'var(--cta-primary-bg)' }}
            >
              View Property
              <span style={{ fontSize: '13px' }}>→</span>
            </span>
          </div>
        </div>

      </div>
    </Link>
  )
}
