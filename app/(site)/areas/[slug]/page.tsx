import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client } from '../../../../sanity/lib/client'
import { areaBySlugQuery, allAreasQuery } from '../../../../sanity/lib/queries'
import { urlFor } from '../../../../sanity/lib/image'
import { PortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import PropertyCard from '../../../../components/property/PropertyCard'
import { CONTACT } from '../../../../lib/constants'
import type { Metadata } from 'next'
import type { Area, PropertyListItem } from '../../../../types'

export const revalidate = 60

// ─── SEO maps ────────────────────────────────────────────────────────────────

const SEO_TITLE: Record<string, string> = {
  ibiza:           'Luxury Properties in Ibiza Town',
  'santa-eulalia': 'Luxury Properties in Santa Eulalia, Ibiza',
  'san-jose':      'Villas for Sale in San José, Ibiza',
  'san-antonio':   'Properties for Sale in San Antonio, Ibiza',
  'san-juan':      'Properties for Sale in San Juan, Ibiza',
}

const SEO_DESCRIPTION: Record<string, string> = {
  ibiza:
    'Discover luxury apartments and villas in Ibiza Town — the cultural heart of the island, with the historic Dalt Vila, the marina and vibrant cosmopolitan energy.',
  'santa-eulalia':
    "Browse elegant villas, sea-view homes and investment properties in Santa Eulalia — family-friendly, sophisticated and home to the island's finest restaurants.",
  'san-jose':
    'Find exclusive estates, cliffside villas and countryside fincas in San José — dramatic coastlines, Es Vedrà views and bohemian hillside living.',
  'san-antonio':
    'Explore stylish residences and beachfront properties in San Antonio — famous for iconic Ibizan sunsets, world-class beach clubs and a vibrant lifestyle.',
  'san-juan':
    'Discover secluded villas and rural fincas in San Juan — the unspoiled north of Ibiza with wild landscapes, total privacy and authentic island character.',
}

// ─── Fix #3: Custom PortableText renderer — replaces Tailwind prose ───────────
// On-brand sizing, weight and colour from the design system.

const areaPtComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p
        style={{
          color:        'var(--text-secondary)',
          lineHeight:   1.85,
          marginBottom: '1.25rem',
          fontFamily:   'var(--font-sans)',
          fontSize:     'clamp(1rem, 1.5vw, 1.0625rem)',
        }}
      >
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        className="font-serif"
        style={{
          color:         'var(--text-primary)',
          fontSize:      'clamp(1.25rem, 2vw, 1.625rem)',
          fontWeight:    500,
          letterSpacing: '-0.02em',
          marginTop:     'clamp(2rem, 3.5vw, 2.75rem)',
          marginBottom:  '0.75rem',
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="font-serif"
        style={{
          color:         'var(--text-primary)',
          fontSize:      'clamp(1.125rem, 1.8vw, 1.375rem)',
          fontWeight:    500,
          letterSpacing: '-0.015em',
          marginTop:     '1.75rem',
          marginBottom:  '0.5rem',
        }}
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote
        style={{
          borderLeft:  '2px solid var(--cta-primary-bg)',
          paddingLeft: '20px',
          marginBlock: '1.75rem',
          color:       'var(--text-secondary)',
          fontStyle:   'italic',
        }}
      >
        {children}
      </blockquote>
    ),
  },
}

// ─── Static params + Metadata ─────────────────────────────────────────────────

export async function generateStaticParams() {
  const areas: Area[] = await client.fetch(allAreasQuery).catch(() => [])
  return areas.map(a => ({ slug: a.slug?.current }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const area: Area | null = await client.fetch(areaBySlugQuery, { slug }).catch(() => null)
  const title       = SEO_TITLE[slug]       ?? `Properties in ${area?.name ?? slug}, Ibiza`
  const description = SEO_DESCRIPTION[slug] ?? area?.summary ?? ''
  const ogImage = area?.heroImage
    ? urlFor(area.heroImage).width(1200).height(630).fit('crop').url()
    : undefined
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] }),
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const area: Area | null = await client.fetch(areaBySlugQuery, { slug }).catch(() => null)
  if (!area) notFound()

  const heroUrl = area.heroImage
    ? urlFor(area.heroImage).width(1920).height(1080).fit('crop').url()
    : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&h=1080&fit=crop'

  const propertyCount   = area.properties?.length ?? 0
  const hasNeighbourhoods = (area.neighborhoods?.length ?? 0) > 0
  const hasGallery       = (area.galleryImages?.length ?? 0) > 0

  return (
    <>
      {/* ── Fix #1 + #2 + #14 + #15: Hero — taller, summary, per-area eyebrow ── */}
      <div
        className="relative"
        style={{ height: 'clamp(560px, 80vh, 900px)' }}
      >
        <Image
          src={heroUrl}
          alt={SEO_TITLE[slug] ?? area.name}
          fill
          priority
          className="object-cover object-[center_38%]"
          sizes="100vw"
        />

        {/* Bottom-up gradient — grounds headline */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(47,58,55,0.92) 0%, rgba(47,58,55,0.35) 55%, transparent 100%)',
          }}
        />
        {/* Fix #14: left directional reduced from 0.38 → 0.22 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(47,58,55,0.22) 0%, transparent 50%)',
          }}
        />

        {/* Hero text — pinned to bottom */}
        <div
          className="absolute bottom-0 w-full"
          style={{ padding: 'clamp(2rem, 5vw, 4.5rem)' }}
        >
          <div className="mx-auto" style={{ maxWidth: 'var(--content-lg)' }}>
            {/* Fix #15: per-area eyebrow instead of hardcoded "Ibiza Area Guide" */}
            <div className="eyebrow-row mb-4">
              <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>
                {area.name} Area Guide
              </span>
            </div>
            <h1
              className="font-serif"
              style={{
                color:         'var(--text-on-dark)',
                fontWeight:    400,
                letterSpacing: '-0.025em',
                marginBottom:  area.summary ? '1.25rem' : 0,
              }}
            >
              {area.name}
            </h1>
            {/* Fix #2: area summary displayed in hero */}
            {area.summary && (
              <p
                className="type-body"
                style={{
                  color:     'rgba(245,240,232,0.80)',
                  maxWidth:  '56ch',
                  lineHeight: 1.7,
                  marginBottom: 0,
                }}
              >
                {area.summary}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Fix #5: Breadcrumb ──────────────────────────────────────────────── */}
      <div style={{ backgroundColor: 'var(--bg-canvas-soft)', borderBottom: '1px solid var(--border-soft)' }}>
        <div
          className="mx-auto"
          style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)', paddingBlock: '13px' }}
        >
          <nav aria-label="Breadcrumb">
            <ol style={{ display: 'flex', alignItems: 'center', gap: 0, listStyle: 'none', margin: 0, padding: 0 }}>
              <li>
                <Link
                  href="/areas"
                  className="type-caption"
                  style={{ color: 'var(--text-tertiary)', textDecoration: 'none', letterSpacing: '0.08em' }}
                >
                  Areas
                </Link>
              </li>
              <li aria-hidden style={{ color: 'var(--border-muted)', margin: '0 8px', fontSize: '11px' }}>/</li>
              <li
                className="type-caption"
                style={{ color: 'var(--text-secondary)', letterSpacing: '0.08em' }}
                aria-current="page"
              >
                {area.name}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── Fix #3 + #10 + #11: Description — on-brand PT, proper structure ── */}
      {area.description && (
        <div style={{ backgroundColor: 'var(--bg-canvas)', paddingBlock: 'clamp(3rem, 6vw, 5rem)' }}>
          <div
            className="mx-auto"
            style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
          >
            <div style={{ maxWidth: '72ch' }}>
              <PortableText value={area.description} components={areaPtComponents} />
            </div>
          </div>
        </div>
      )}

      {/* ── Fix #6: Neighbourhoods — data rendered for the first time ──────── */}
      {hasNeighbourhoods && (
        <div style={{ backgroundColor: 'var(--bg-section-muted)', paddingBlock: 'clamp(3rem, 5vw, 4.5rem)' }}>
          <div
            className="mx-auto"
            style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
          >
            <div className="eyebrow-row mb-5">
              <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>
                Neighbourhoods
              </span>
            </div>
            <h2
              className="font-serif"
              style={{
                color:         'var(--text-primary)',
                fontWeight:    500,
                fontSize:      'clamp(1.5rem, 2.5vw, 2rem)',
                letterSpacing: '-0.02em',
                marginBottom:  'clamp(1.75rem, 3vw, 2.5rem)',
              }}
            >
              Key Areas within {area.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {area.neighborhoods?.map((n) => (
                <div
                  key={n.name}
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    border:          '1px solid var(--border-soft)',
                    padding:         'clamp(1.25rem, 2.5vw, 1.75rem)',
                  }}
                >
                  <h3
                    className="font-serif"
                    style={{
                      color:         'var(--text-primary)',
                      fontSize:      '1.125rem',
                      fontWeight:    500,
                      letterSpacing: '-0.01em',
                      marginBottom:  n.note ? '0.5rem' : 0,
                    }}
                  >
                    {n.name}
                  </h3>
                  {n.note && (
                    <p
                      className="type-body-sm"
                      style={{ color: 'var(--text-secondary)', marginBottom: 0, lineHeight: 1.7 }}
                    >
                      {n.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Fix #7: Gallery — fetched data now displayed ───────────────────── */}
      {hasGallery && (
        <div style={{ backgroundColor: 'var(--bg-canvas)', paddingBlock: 'clamp(3rem, 5vw, 4.5rem)' }}>
          <div
            className="mx-auto"
            style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
          >
            <div className="eyebrow-row mb-5">
              <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>Gallery</span>
            </div>
            <h2
              className="font-serif"
              style={{
                color:         'var(--text-primary)',
                fontWeight:    500,
                fontSize:      'clamp(1.5rem, 2.5vw, 2rem)',
                letterSpacing: '-0.02em',
                marginBottom:  'clamp(1.75rem, 3vw, 2.5rem)',
              }}
            >
              {area.name} in Pictures
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {area.galleryImages?.slice(0, 6).map((img, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden"
                  style={{ aspectRatio: '4 / 3' }}
                >
                  <Image
                    src={urlFor(img).width(800).height(600).fit('crop').url()}
                    alt={`${area.name} — image ${i + 1}`}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Fix #4 + #12 + #13: Listings — count in eyebrow, visual break ──── */}
      {propertyCount > 0 && (
        <div style={{ backgroundColor: 'var(--bg-canvas-soft)', paddingBlock: 'clamp(3rem, 5vw, 4.5rem)' }}>
          <div
            className="mx-auto"
            style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4" style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
              <div>
                {/* Fix #4: count moved from h2 to eyebrow */}
                <div className="eyebrow-row mb-3">
                  <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>
                    Available Now
                    <span style={{ opacity: 0.45, margin: '0 8px' }}>·</span>
                    {propertyCount} {propertyCount === 1 ? 'property' : 'properties'}
                  </span>
                </div>
                {/* Fix #13: fontWeight 400 → 500 */}
                <h2
                  className="font-serif"
                  style={{
                    color:         'var(--text-primary)',
                    fontWeight:    500,
                    letterSpacing: '-0.02em',
                    fontSize:      'clamp(1.5rem, 2.5vw, 2rem)',
                    marginBottom:  0,
                  }}
                >
                  Properties in {area.name}
                </h2>
              </div>
              <Link href={`/properties?area=${slug}`} className="section-more-link shrink-0">
                View all {area.name} listings
                <span className="block h-px bg-current" style={{ width: '24px' }} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {area.properties?.map((p: PropertyListItem, i: number) => (
                <PropertyCard key={p._id} property={p} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Fix #9: Empty state — editorial rather than broken ─────────────── */}
      {propertyCount === 0 && (
        <div
          style={{
            backgroundColor: 'var(--bg-deep)',
            paddingBlock:    'clamp(4rem, 8vw, 7rem)',
            paddingInline:   'clamp(1.5rem, 5vw, 4rem)',
            textAlign:       'center',
          }}
        >
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <div className="eyebrow-row justify-center mb-5" style={{ justifyContent: 'center' }}>
              <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>
                Coming Soon
              </span>
            </div>
            <h2
              className="font-serif"
              style={{
                color:         'var(--text-on-dark)',
                fontWeight:    500,
                fontSize:      'clamp(1.5rem, 2.5vw, 2.25rem)',
                letterSpacing: '-0.02em',
                marginBottom:  '1.25rem',
                lineHeight:    1.1,
              }}
            >
              Listings arrive quietly.
            </h2>
            <p
              className="type-body-sm"
              style={{
                color:        'rgba(245,240,232,0.62)',
                lineHeight:   1.8,
                marginBottom: '2rem',
              }}
            >
              We are curating an exclusive portfolio for {area.name}. Register to be
              notified when new properties become available — before they are listed publicly.
            </p>
            <Link
              href="/contact"
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
            >
              Register Your Interest
            </Link>
          </div>
        </div>
      )}

      {/* ── Fix #8: Closing CTA ─────────────────────────────────────────────── */}
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
                  Interested in {area.name}?
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
                Let us find your ideal<br />property here.
              </h2>
              <p
                className="type-body-sm"
                style={{ color: 'rgba(245,240,232,0.65)', lineHeight: 1.8, marginBottom: 0 }}
              >
                Our advisors know {area.name} intimately — every neighbourhood, every
                micro-climate, and the properties that never reach the public market. Tell
                us what you're looking for and we'll do the rest.
              </p>
            </div>

            <div
              className="flex flex-col sm:flex-row lg:flex-col gap-3"
              style={{ flexShrink: 0 }}
            >
              <a href={CONTACT.phoneHref} className="btn-primary">
                <span aria-hidden>↗</span>
                {CONTACT.phone}
              </a>
              <a href={CONTACT.emailHref} className="btn-ghost-dark">
                <span style={{ opacity: 0.5 }} aria-hidden>↗</span>
                {CONTACT.email}
              </a>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
