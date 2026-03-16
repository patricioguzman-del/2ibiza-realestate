import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client } from '../../../../sanity/lib/client'
import { areaBySlugQuery, allAreasQuery } from '../../../../sanity/lib/queries'
import { urlFor } from '../../../../sanity/lib/image'
import { PortableText } from '@portabletext/react'
import PropertyCard from '../../../../components/property/PropertyCard'
import type { Metadata } from 'next'
import type { Area, PropertyListItem } from '../../../../types'

export const revalidate = 60

// SEO title patterns — match the high-value keyword targets per municipality
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

export default async function AreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const area: Area | null = await client.fetch(areaBySlugQuery, { slug }).catch(() => null)
  if (!area) notFound()

  const heroUrl = area.heroImage
    ? urlFor(area.heroImage).width(1920).height(1080).fit('crop').url()  // 16:9
    : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&h=1080&fit=crop'

  const pageTitle = SEO_TITLE[slug] ?? `Properties in ${area.name}, Ibiza`

  return (
    <>
      {/* ── Hero — 16:9 cinematic, dual-axis gradient ─────────────── */}
      <div className="relative" style={{ height: '62vh', minHeight: '440px' }}>
        <Image
          src={heroUrl}
          alt={pageTitle}
          fill
          priority
          className="object-cover object-[center_38%]"
          sizes="100vw"
        />
        {/* Bottom-up gradient — grounds headline text */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(47,58,55,0.85) 0%, rgba(47,58,55,0.22) 55%, transparent 100%)',
          }}
        />
        {/* Left directional — reinforces readability per brand spec */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(47,58,55,0.38) 0%, transparent 55%)',
          }}
        />
        <div
          className="absolute bottom-0 w-full"
          style={{ padding: 'clamp(1.5rem, 4vw, 4rem)' }}
        >
          <div className="mx-auto" style={{ maxWidth: 'var(--content-lg)' }}>
            <div className="eyebrow-row mb-3">
              <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>
                Ibiza Area Guide
              </span>
            </div>
            <h1
              className="font-serif"
              style={{
                color:         'var(--text-on-dark)',
                fontWeight:    400,
                letterSpacing: '-0.025em',
              }}
            >
              {area.name}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: 'var(--bg-canvas)', paddingBlock: 'clamp(3rem, 6vh, 5rem)' }}>
        <div
          className="mx-auto"
          style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
        >
          {/* Area description */}
          {area.description && (
            <div style={{ maxWidth: '72ch', marginBottom: 'clamp(3rem, 5vh, 4rem)' }}>
              <div
                className="prose prose-headings:font-serif prose-headings:font-light"
                style={{
                  fontSize:   'clamp(1.0625rem, 1.5vw, 1.1875rem)',
                  lineHeight: 1.82,
                  color:      'var(--text-secondary)',
                }}
              >
                <PortableText value={area.description} />
              </div>
            </div>
          )}

          {/* ── Properties ───────────────────────────────────────── */}
          {(area.properties?.length ?? 0) > 0 && (
            <div>
              <div className="eyebrow-row mb-5">
                <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>
                  Available Now
                </span>
              </div>
              <h2
                className="font-serif"
                style={{
                  color:         'var(--text-primary)',
                  fontWeight:    400,
                  letterSpacing: '-0.02em',
                  marginBottom:  '2rem',
                  fontSize:      'clamp(1.5rem, 2.5vw, 2rem)',
                }}
              >
                Properties in {area.name}
                <span
                  className="type-caption"
                  style={{ color: 'var(--text-secondary)', marginLeft: '0.75rem' }}
                >
                  ({area.properties?.length})
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {area.properties?.map((p: PropertyListItem) => (
                  <PropertyCard key={p._id} property={p} />
                ))}
              </div>
            </div>
          )}

          {/* Empty state — no properties yet */}
          {(!area.properties || area.properties.length === 0) && (
            <div
              style={{
                paddingBlock:    '3rem',
                textAlign:       'center',
                borderTop:       '1px solid var(--border-soft)',
              }}
            >
              <p className="type-body" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                We are curating listings for {area.name}. New properties arrive regularly.
              </p>
              <Link href="/contact" className="btn-primary">
                Register Your Interest
              </Link>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
