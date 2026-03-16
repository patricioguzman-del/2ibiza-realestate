import Image from 'next/image'
import Link from 'next/link'
import { client } from '../../../sanity/lib/client'
import { allAreasQuery } from '../../../sanity/lib/queries'
import { urlFor } from '../../../sanity/lib/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Areas of Ibiza | Luxury Property by Municipality',
  description:
    "Explore luxury properties across Ibiza's five municipalities — Ibiza Town, Santa Eulalia, San Jose, San Antonio and San Juan. Each area has its own character.",
}

export const revalidate = 60

// The five official municipalities of Ibiza — single source of truth.
// Micro-zones live inside each area's dedicated page.
const PRIMARY_AREAS = [
  {
    _id:          'ibiza',
    slug:         { current: 'ibiza' },
    name:         'Ibiza',
    descriptor:   'The cultural heart — Dalt Vila, the marina and cosmopolitan island life',
    seoTitle:     'Luxury Properties in Ibiza Town',
    heroImage:    null,
    propertyCount: null,
  },
  {
    _id:          'santa-eulalia',
    slug:         { current: 'santa-eulalia' },
    name:         'Santa Eulalia',
    descriptor:   "Family-friendly coastal living, elegant villas and the island's finest dining",
    seoTitle:     'Luxury Properties in Santa Eulalia',
    heroImage:    null,
    propertyCount: null,
  },
  {
    _id:          'san-jose',
    slug:         { current: 'san-jose' },
    name:         'San José',
    descriptor:   'Dramatic sea cliffs, Es Vedrà views and discreet hillside estates',
    seoTitle:     'Villas for Sale in San José Ibiza',
    heroImage:    null,
    propertyCount: null,
  },
  {
    _id:          'san-antonio',
    slug:         { current: 'san-antonio' },
    name:         'San Antonio',
    descriptor:   'Iconic sunsets, world-class beach clubs and stylish waterfront residences',
    seoTitle:     'Properties for Sale in San Antonio Ibiza',
    heroImage:    null,
    propertyCount: null,
  },
  {
    _id:          'san-juan',
    slug:         { current: 'san-juan' },
    name:         'San Juan',
    descriptor:   'The unspoiled north — wild beauty, absolute privacy and pure island character',
    seoTitle:     'Properties for Sale in San Juan Ibiza',
    heroImage:    null,
    propertyCount: null,
  },
]

const FALLBACK_IMAGES: Record<string, string> = {
  ibiza:           'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&h=900&fit=crop',
  'santa-eulalia': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&h=900&fit=crop',
  'san-jose':      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&h=900&fit=crop',
  'san-antonio':   'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&h=900&fit=crop',
  'san-juan':      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=900&fit=crop',
}

export default async function AreasPage() {
  const sanityAreas = await client.fetch(allAreasQuery).catch(() => [])
  const sanityBySlug = Object.fromEntries(
    (sanityAreas as any[]).map((a: any) => [a.slug?.current, a])
  )

  const areas = PRIMARY_AREAS.map((pa) => {
    const s = sanityBySlug[pa.slug.current]
    return {
      ...pa,
      propertyCount: s?.propertyCount ?? null,
      heroImage:     s?.heroImage     ?? null,
    }
  })

  return (
    <>
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div style={{ backgroundColor: 'var(--bg-deep)', paddingTop: '8rem', paddingBottom: '4rem' }}>
        <div
          className="mx-auto"
          style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
        >
          <div className="eyebrow-row mb-[10px]">
            <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>
              Discover the Island
            </span>
          </div>
          <h1
            className="font-serif"
            style={{
              color:         'var(--text-on-dark)',
              fontWeight:    400,
              letterSpacing: '-0.025em',
              marginBottom:  '1rem',
            }}
          >
            Areas of Ibiza
          </h1>
          <p className="type-body" style={{ color: 'rgba(245,240,232,0.76)', maxWidth: '60ch' }}>
            Ibiza is divided into five municipalities, each with its own landscape, lifestyle and
            property character. Explore them below to find the area that suits you.
          </p>
        </div>
      </div>

      {/* ── Area Cards ──────────────────────────────────────────────── */}
      <div className="section-major" style={{ backgroundColor: 'var(--bg-canvas)' }}>
        <div
          className="mx-auto"
          style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {areas.map((area, i) => {
              const imgSrc = area.heroImage
                ? urlFor(area.heroImage).width(900).height(680).fit('crop').url()
                : FALLBACK_IMAGES[area.slug.current] ?? FALLBACK_IMAGES['ibiza']

              return (
                <Link
                  key={area._id}
                  href={`/areas/${area.slug.current}`}
                  className="group block no-underline"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ height: '17rem' }}>
                    <Image
                      src={imgSrc}
                      alt={area.seoTitle}
                      fill
                      priority={i < 3}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(47,58,55,0.65) 0%, transparent 60%)',
                      }}
                    />
                    {area.propertyCount !== null && (
                      <p
                        className="absolute bottom-4 left-5 type-eyebrow"
                        style={{ color: 'rgba(245,240,232,0.75)', zIndex: 10 }}
                      >
                        {area.propertyCount} properties
                      </p>
                    )}
                  </div>

                  {/* Text block */}
                  <div
                    className="area-listing-card-text"
                    style={{
                      padding:         '1.5rem 1.25rem',
                      backgroundColor: 'var(--bg-canvas-soft)',
                    }}
                  >
                    <h2
                      className="font-serif transition-colors duration-200 group-hover:[color:var(--accent-sea)]"
                      style={{
                        fontSize:      'clamp(1.375rem, 2vw, 1.75rem)',
                        fontWeight:    400,
                        letterSpacing: '-0.01em',
                        color:         'var(--text-primary)',
                        marginBottom:  '0.5rem',
                      }}
                    >
                      {area.name}
                    </h2>
                    <p
                      className="type-body-sm"
                      style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}
                    >
                      {area.descriptor}
                    </p>
                    <span
                      className="type-btn flex items-center gap-2"
                      style={{ color: 'var(--cta-primary-bg)' }}
                    >
                      Explore Area
                      <span
                        className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                        aria-hidden
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
