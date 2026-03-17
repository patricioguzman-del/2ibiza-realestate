import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '../../sanity/lib/image'
import type { Area, SanityImage } from '../../types'
import { BLUR_DARK } from '../../lib/constants'

interface AreasGridProps {
  areas: Area[]
}

// The five primary municipalities of Ibiza
const PRIMARY_AREAS = [
  {
    slug:       'ibiza',
    name:       'Ibiza',
    descriptor: 'The cultural heart — Dalt Vila, the marina and cosmopolitan island life',
  },
  {
    slug:       'santa-eulalia',
    name:       'Santa Eulalia',
    descriptor: "Family-friendly coastal living, elegant villas and the island's finest dining",
  },
  {
    slug:       'san-jose',
    name:       'San José',
    descriptor: 'Dramatic sea cliffs, Es Vedrà views and discreet hillside estates',
  },
  {
    slug:       'san-antonio',
    name:       'San Antonio',
    descriptor: 'Iconic sunsets, world-class beach clubs and stylish waterfront residences',
  },
  {
    slug:       'san-juan',
    name:       'San Juan',
    descriptor: 'The unspoiled north — wild beauty, absolute privacy and pure island character',
  },
]

const FALLBACK_IMAGES: Record<string, string> = {
  ibiza:           'https://images.unsplash.com/photo-1563784462030-fe92bbdcf857?w=1400&h=1000&fit=crop',
  'santa-eulalia': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&h=700&fit=crop',
  'san-jose':      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=700&fit=crop',
  'san-antonio':   'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=700&fit=crop',
  'san-juan':      'https://images.unsplash.com/photo-1579861848178-485376071845?w=900&h=700&fit=crop',
}

function AreaCard({
  slug,
  name,
  descriptor,
  propertyCount,
  heroImage,
  priority  = false,
  isHero    = false,
}: {
  slug:          string
  name:          string
  descriptor:    string
  propertyCount: number | null
  heroImage:     SanityImage | null
  priority?:     boolean
  isHero?:       boolean
}) {
  const img = heroImage
    ? urlFor(heroImage).width(isHero ? 1200 : 900).height(isHero ? 1000 : 700).fit('crop').url()
    : FALLBACK_IMAGES[slug] ?? FALLBACK_IMAGES['ibiza']

  return (
    <div
      className="area-card-hover"
      style={isHero ? { height: '100%' } : {}}
    >
      <Link
        href={`/areas/${slug}`}
        className="group relative block overflow-hidden no-underline"
        style={
          isHero
            ? { height: '100%', minHeight: '480px', display: 'block' }
            : { aspectRatio: '5/4' }
        }
      >
        {/* Image */}
        <Image
          src={img}
          alt={`Properties in ${name}, Ibiza`}
          fill
          priority={priority}
          placeholder="blur"
          blurDataURL={BLUR_DARK}
          className="object-cover object-[center_40%] transition-transform duration-200 ease-out group-hover:scale-[1.03]"
          sizes={
            isHero
              ? '(max-width: 1024px) 100vw, 50vw'
              : '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw'
          }
        />

        {/* Base overlay — bottom-weighted gradient, stronger on small cards */}
        <div
          className="absolute inset-0"
          style={{
            background: isHero
              ? 'linear-gradient(to top, rgba(47,58,55,0.92) 0%, rgba(47,58,55,0.36) 48%, rgba(47,58,55,0.06) 100%)'
              : 'linear-gradient(to top, rgba(47,58,55,0.94) 0%, rgba(47,58,55,0.55) 50%, rgba(47,58,55,0.22) 100%)',
          }}
        />

        {/* Hover layer */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out"
          style={{ background: 'rgba(47,58,55,0.15)' }}
        />

        {/* Editorial quote — hero card only, upper area */}
        {isHero && (
          <div
            className="absolute z-10"
            style={{
              top:   'clamp(1.75rem, 7%, 2.75rem)',
              left:  'clamp(1.25rem, 5%, 1.75rem)',
              right: 'clamp(1.25rem, 5%, 1.75rem)',
            }}
          >
            <p
              style={{
                fontFamily:    'var(--font-serif)',
                fontSize:      'clamp(1rem, 2.2vw, 1.75rem)',
                fontStyle:     'italic',
                fontWeight:    300,
                lineHeight:    1.2,
                color:         'rgba(245,240,232,0.50)',
                letterSpacing: '-0.02em',
                maxWidth:      '18ch',
                margin:        0,
              }}
            >
              The island doesn&apos;t negotiate on beauty.
            </p>
          </div>
        )}

        {/* Content block — bottom */}
        <div
          className="absolute inset-0 z-10 flex flex-col justify-end"
          style={{ padding: isHero ? 'clamp(1.5rem, 4%, 2rem)' : '1.25rem' }}
        >
          {propertyCount !== null && propertyCount > 0 && (
            <p
              className="type-eyebrow mb-2"
              style={{ color: 'rgba(245,240,232,0.48)', fontSize: '10px' }}
            >
              {propertyCount} {propertyCount === 1 ? 'listing' : 'listings'}
            </p>
          )}

          <h3
            className="font-serif"
            style={{
              fontSize:      isHero ? 'clamp(1.5rem, 2.8vw, 2.25rem)' : 'clamp(1.1rem, 1.6vw, 1.45rem)',
              fontWeight:    400,
              letterSpacing: '-0.02em',
              lineHeight:    1.1,
              color:         'var(--text-on-dark)',
              marginBottom:  '8px',
            }}
          >
            {name}
          </h3>

          <p
            style={{
              fontFamily:   'var(--font-sans)',
              fontSize:     isHero ? '13px' : '12px',
              lineHeight:   1.55,
              color:        'rgba(245,240,232,0.68)',
              marginBottom: isHero ? '18px' : '14px',
            }}
          >
            {descriptor}
          </p>

          <span
            className="type-btn flex items-center gap-2 transition-colors duration-200 group-hover:[color:var(--accent-sand)]"
            style={{ color: 'rgba(245,240,232,0.72)', width: 'fit-content', fontSize: '10px' }}
          >
            Explore
            <span
              className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-[5px]"
              aria-hidden
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </div>
  )
}

export default function AreasGrid({ areas }: AreasGridProps) {
  const sanityBySlug = Object.fromEntries(
    (areas ?? []).map(a => [a.slug?.current, a])
  )

  const cards = PRIMARY_AREAS.map((pa) => {
    const s = sanityBySlug[pa.slug]
    return {
      ...pa,
      propertyCount: s?.propertyCount ?? null,
      heroImage:     s?.heroImage     ?? null,
    }
  })

  const [c1, c2, c3, c4, c5] = cards as typeof cards

  return (
    <section className="section-major" style={{ backgroundColor: 'var(--bg-section-muted)' }}>
      <div
        className="mx-auto"
        style={{
          maxWidth:      'var(--content-lg)',
          paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
        }}
      >

        {/* ── Section header ────────────────────────────────────────────── */}
        <div style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
          <div className="eyebrow-row mb-[10px]">
            <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>
              Explore Ibiza
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 style={{ color: 'var(--text-primary)', marginBottom: 0, maxWidth: '22ch' }}>
              Discover each corner of the island
            </h2>
            <p
              className="type-body-sm"
              style={{
                color:        'var(--text-secondary)',
                maxWidth:     '380px',
                lineHeight:   1.68,
                marginBottom: 0,
              }}
            >
              From vibrant Ibiza Town to the wild, unspoiled north — every area
              has its own character and lifestyle.
            </p>
          </div>
        </div>

        {/* ── Mobile / tablet: 3+2 stacked layout (< lg) ───────────────── */}
        <div className="lg:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <AreaCard {...c1} priority />
            <AreaCard {...c2} />
            <AreaCard {...c3} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AreaCard {...c4} />
            <AreaCard {...c5} />
          </div>
        </div>

        {/* ── Desktop: asymmetric masonry — hero left + 2×2 right (lg+) ── */}
        <div
          className="hidden lg:grid"
          style={{
            gridTemplateColumns: '1fr 1fr',
            gap:                 '16px',
            alignItems:          'stretch',
          }}
        >
          {/* Left — hero card fills full height */}
          <div style={{ height: '100%' }}>
            <AreaCard {...c1} priority isHero />
          </div>

          {/* Right — 2×2 grid */}
          <div
            style={{
              display:             'grid',
              gridTemplateColumns: '1fr 1fr',
              gap:                 '16px',
            }}
          >
            <AreaCard {...c2} />
            <AreaCard {...c3} />
            <AreaCard {...c4} />
            <AreaCard {...c5} />
          </div>
        </div>

      </div>
    </section>
  )
}
