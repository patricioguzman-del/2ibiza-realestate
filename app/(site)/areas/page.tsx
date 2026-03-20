import Image from 'next/image'
import Link from 'next/link'
import { client } from '../../../sanity/lib/client'
import { allAreasQuery } from '../../../sanity/lib/queries'
import { urlFor } from '../../../sanity/lib/image'
import { CONTACT } from '../../../lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Areas of Ibiza | Luxury Property by Municipality',
  description:
    "Explore luxury properties across Ibiza's five municipalities — Ibiza Town, Santa Eulalia, San Jose, San Antonio and San Juan. Each area has its own character.",
}

export const revalidate = 60

// ─── Primary areas ────────────────────────────────────────────────────────────

const PRIMARY_AREAS = [
  {
    _id:         'ibiza',
    slug:        { current: 'ibiza' },
    name:        'Ibiza',
    descriptor:  'The cultural heart — Dalt Vila, the ancient marina and cosmopolitan island life',
    seoTitle:    'Luxury Properties in Ibiza Town',
    heroImage:   null,
    propertyCount: null,
  },
  {
    _id:         'santa-eulalia',
    slug:        { current: 'santa-eulalia' },
    name:        'Santa Eulalia',
    descriptor:  "Family-friendly coastal living, elegant villas and the island's finest dining",
    seoTitle:    'Luxury Properties in Santa Eulalia',
    heroImage:   null,
    propertyCount: null,
  },
  {
    _id:         'san-jose',
    slug:        { current: 'san-jose' },
    name:        'San José',
    descriptor:  'Dramatic sea cliffs, Es Vedrà views and discreet hillside estates',
    seoTitle:    'Villas for Sale in San José Ibiza',
    heroImage:   null,
    propertyCount: null,
  },
  {
    _id:         'san-antonio',
    slug:        { current: 'san-antonio' },
    name:        'San Antonio',
    descriptor:  'Iconic sunsets, world-class beach clubs and stylish waterfront residences',
    seoTitle:    'Properties for Sale in San Antonio Ibiza',
    heroImage:   null,
    propertyCount: null,
  },
  {
    _id:         'san-juan',
    slug:        { current: 'san-juan' },
    name:        'San Juan',
    descriptor:  'The unspoiled north — wild beauty, absolute privacy and pure island character',
    seoTitle:    'Properties for Sale in San Juan Ibiza',
    heroImage:   null,
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
      {/* ── Fix #6: Richer, taller page header ──────────────────────────── */}
      <div
        style={{
          backgroundColor: 'var(--bg-deep)',
          paddingTop:      'clamp(6rem, 10vw, 9rem)',
          paddingBottom:   'clamp(3.5rem, 6vw, 5rem)',
          borderBottom:    '1px solid var(--border-dark)',
        }}
      >
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
              marginBottom:  '1.25rem',
            }}
          >
            Areas of Ibiza
          </h1>
          {/* Fix #6: More evocative copy — speaks to lifestyle, not just geography */}
          <p
            className="type-body"
            style={{ color: 'var(--text-secondary)', maxWidth: '58ch', lineHeight: 1.8 }}
          >
            Every corner of the island carries its own distinct character — from the ancient
            walls and marina of Ibiza Town to the wild silence of the unspoiled north.
            Understanding the areas is the first step to finding your ideal property.
          </p>
        </div>
      </div>

      {/* ── Area Cards ──────────────────────────────────────────────────── */}
      {/* Fix #5: tighter top padding — was section-major which added ~120px dead space */}
      <div
        style={{
          backgroundColor: 'var(--bg-canvas)',
          paddingTop:      'clamp(3rem, 5vw, 4.5rem)',
          paddingBottom:   'clamp(3rem, 5vw, 4.5rem)',
        }}
      >
        <div
          className="mx-auto"
          style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {areas.map((area) => {
              const imgSrc = area.heroImage
                ? urlFor(area.heroImage).width(900).height(680).fit('crop').url()
                : FALLBACK_IMAGES[area.slug.current] ?? FALLBACK_IMAGES['ibiza']

              // Fix #2 + #3: hide when 0, correct singular/plural
              const countLabel =
                area.propertyCount && area.propertyCount > 0
                  ? `${area.propertyCount} ${area.propertyCount === 1 ? 'property' : 'properties'}`
                  : null

              return (
                <Link
                  key={area._id}
                  href={`/areas/${area.slug.current}`}
                  className="group block no-underline"
                >
                  {/* Fix #7: taller image — was 17rem */}
                  <div
                    className="relative overflow-hidden"
                    style={{ height: 'clamp(18rem, 22vw, 22rem)' }}
                  >
                    <Image
                      src={imgSrc}
                      alt={area.seoTitle}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(47,58,55,0.78) 0%, rgba(47,58,55,0.18) 55%, transparent 100%)',
                      }}
                    />

                    {/* Fix #10: property count badge — dark pill for legibility */}
                    {countLabel && (
                      <p
                        className="absolute bottom-4 left-5 type-eyebrow"
                        style={{
                          color:           'rgba(245,240,232,0.92)',
                          zIndex:          10,
                          backgroundColor: 'rgba(47,58,55,0.52)',
                          backdropFilter:  'blur(6px)',
                          WebkitBackdropFilter: 'blur(6px)',
                          padding:         '3px 10px',
                          letterSpacing:   '0.12em',
                        }}
                      >
                        {countLabel}
                      </p>
                    )}
                  </div>

                  {/* Fix #12: surface-primary with border — more distinct than bg-canvas-soft */}
                  <div
                    style={{
                      padding:         '1.5rem 1.5rem 1.625rem',
                      backgroundColor: 'var(--surface-primary)',
                      borderLeft:      '1px solid var(--border-muted)',
                      borderRight:     '1px solid var(--border-muted)',
                      borderBottom:    '1px solid var(--border-muted)',
                    }}
                  >
                    {/* Fix #13: fontWeight 400 → 500 */}
                    <h2
                      className="font-serif transition-colors duration-200 group-hover:[color:var(--accent-sea)]"
                      style={{
                        fontSize:      'clamp(1.375rem, 2vw, 1.75rem)',
                        fontWeight:    500,
                        letterSpacing: '-0.015em',
                        color:         'var(--text-primary)',
                        marginBottom:  '0.5rem',
                      }}
                    >
                      {area.name}
                    </h2>
                    <p
                      className="type-body-sm"
                      style={{ color: 'var(--text-secondary)', marginBottom: '1.125rem', lineHeight: 1.7 }}
                    >
                      {area.descriptor}
                    </p>
                    {/* Fix #9: specific CTA label per area */}
                    <span
                      className="type-btn flex items-center gap-2"
                      style={{ color: 'var(--cta-primary-bg)' }}
                    >
                      Explore {area.name}
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

            {/* Fix #4: 6th editorial card — fills the orphaned grid slot + conversion hook */}
            <div
              style={{
                backgroundColor: 'var(--bg-deep)',
                display:         'flex',
                flexDirection:   'column',
                justifyContent:  'center',
                padding:         'clamp(2rem, 4vw, 3rem)',
                minHeight:       'clamp(18rem, 22vw, 22rem)',
              }}
            >
              <div className="eyebrow-row mb-5">
                <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>
                  Not sure where to start?
                </span>
              </div>
              <h2
                className="font-serif"
                style={{
                  color:         'var(--text-on-dark)',
                  fontWeight:    500,
                  fontSize:      'clamp(1.375rem, 2vw, 1.75rem)',
                  letterSpacing: '-0.015em',
                  lineHeight:    1.15,
                  marginBottom:  '1rem',
                }}
              >
                Let us guide you to the right area.
              </h2>
              <p
                className="type-body-sm"
                style={{
                  color:         'var(--text-secondary)',
                  lineHeight:    1.75,
                  marginBottom:  '1.75rem',
                }}
              >
                Our advisors know every neighbourhood and micro-zone intimately. Tell us what
                matters to you and we'll find your ideal corner of the island.
              </p>
              <Link
                href="/contact"
                className="btn-primary"
                style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  alignSelf:      'flex-start',
                  textDecoration: 'none',
                  gap:            '8px',
                }}
              >
                Speak to an Advisor
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ── Fix #8: Closing CTA section ─────────────────────────────────── */}
      <section
        style={{
          backgroundColor: 'var(--bg-deep)',
          paddingBlock:    'clamp(3.5rem, 6vw, 5.5rem)',
          borderTop:       '1px solid var(--border-dark)',
        }}
      >
        <div
          className="mx-auto"
          style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-20">

            <div style={{ maxWidth: '520px' }}>
              <div className="eyebrow-row mb-5">
                <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>
                  Ready to explore?
                </span>
              </div>
              <h2
                className="font-serif"
                style={{
                  color:         'var(--text-on-dark)',
                  fontWeight:    500,
                  lineHeight:    1.05,
                  marginBottom:  '18px',
                }}
              >
                Find your property<br />across the island.
              </h2>
              <p
                className="type-body-sm"
                style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 0 }}
              >
                Browse our curated portfolio of villas, fincas and apartments — or speak
                directly with an advisor who can match you to properties that fit your
                lifestyle, budget and preferred area.
              </p>
            </div>

            <div
              className="flex flex-col sm:flex-row lg:flex-col gap-3"
              style={{ flexShrink: 0 }}
            >
              <Link href="/properties" className="btn-primary">
                Browse All Properties
              </Link>
              <a href={CONTACT.phoneHref} className="btn-ghost-dark">
                <span style={{ opacity: 0.5 }} aria-hidden>↗</span>
                {CONTACT.phone}
              </a>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
