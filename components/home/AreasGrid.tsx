import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '../../sanity/lib/image'
import type { Area, SanityImage } from '../../types'
import { BLUR_DARK } from '../../lib/constants'

interface AreasGridProps {
  areas: Area[]
}

// The five primary municipalities of Ibiza — these are the only areas shown on the homepage.
// Micro-zones (Cala Jondal, Jesús, Portinatx, etc.) live inside each area's dedicated page.
const PRIMARY_AREAS = [
  {
    slug: 'ibiza',
    name: 'Ibiza',
    descriptor: 'The cultural heart — Dalt Vila, the marina and cosmopolitan island life',
  },
  {
    slug: 'santa-eulalia',
    name: 'Santa Eulalia',
    descriptor: "Family-friendly coastal living, elegant villas and the island's finest dining",
  },
  {
    slug: 'san-jose',
    name: 'San José',
    descriptor: 'Dramatic sea cliffs, Es Vedrà views and discreet hillside estates',
  },
  {
    slug: 'san-antonio',
    name: 'San Antonio',
    descriptor: 'Iconic sunsets, world-class beach clubs and stylish waterfront residences',
  },
  {
    slug: 'san-juan',
    name: 'San Juan',
    descriptor: 'The unspoiled north — wild beauty, absolute privacy and pure island character',
  },
]

const FALLBACK_IMAGES: Record<string, string> = {
  ibiza:          'https://images.unsplash.com/photo-1563784462030-fe92bbdcf857?w=1400&h=900&fit=crop',
  'santa-eulalia':'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&h=900&fit=crop',
  'san-jose':     'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&h=900&fit=crop',
  'san-antonio':  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&h=900&fit=crop',
  'san-juan':     'https://images.unsplash.com/photo-1579861848178-485376071845?w=1400&h=900&fit=crop',
}

// Reusable area card — pure CSS hover via Tailwind group (no client state needed)
function AreaCard({
  slug,
  name,
  descriptor,
  propertyCount,
  heroImage,
  priority = false,
}: {
  slug: string
  name: string
  descriptor: string
  propertyCount: number | null
  heroImage: SanityImage | null
  priority?: boolean
}) {
  const img = heroImage
    ? urlFor(heroImage).width(800).height(800).fit('crop').url()  // 1:1
    : FALLBACK_IMAGES[slug] ?? FALLBACK_IMAGES['ibiza']

  return (
    /*
      Outer div: area-card-hover provides translateY(-3px) + shadow on hover.
      Cannot put overflow-hidden here — shadow must be visible outside the element.

      Inner Link: overflow-hidden clips the zooming image.
      The group class propagates hover to all group-* descendants.
    */
    <div className="area-card-hover">
      <Link
        href={`/areas/${slug}`}
        className="group relative block overflow-hidden no-underline"
        style={{ aspectRatio: '5/4' }}
      >
        {/* Image — scale 1.03 (softer than property cards — feels like a destination) */}
        <Image
          src={img}
          alt={`Properties in ${name}, Ibiza`}
          fill
          priority={priority}
          placeholder="blur"
          blurDataURL={BLUR_DARK}
          className="object-cover object-[center_40%] transition-transform duration-200 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />

        {/* Base overlay — bottom-weighted gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(47,58,55,0.88) 0%, rgba(47,58,55,0.32) 50%, rgba(47,58,55,0.06) 100%)',
          }}
        />

        {/* Hover layer — tonal darkening, 200ms */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out"
          style={{ background: 'rgba(47,58,55,0.15)' }}
        />

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-5">
          {propertyCount !== null && (
            <p className="type-eyebrow mb-2" style={{ color: 'rgba(245,240,232,0.55)', fontSize: '10px' }}>
              {propertyCount} listings
            </p>
          )}

          <h3
            className="font-serif"
            style={{
              fontSize:      'clamp(1.1rem, 1.6vw, 1.45rem)',
              fontWeight:    400,
              letterSpacing: '-0.02em',
              lineHeight:    1.1,
              color:         'var(--text-on-dark)',
              marginBottom:  '6px',
            }}
          >
            {name}
          </h3>

          <p
            style={{
              fontFamily:   'var(--font-sans)',
              fontSize:     '12px',
              lineHeight:   1.55,
              color:        'rgba(245,240,232,0.68)',
              marginBottom: '14px',
            }}
          >
            {descriptor}
          </p>

          <span
            className="type-btn flex items-center gap-2 transition-colors duration-200 group-hover:[color:var(--accent-sand)]"
            style={{ color: 'rgba(245,240,232,0.78)', width: 'fit-content', fontSize: '10px' }}
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
  // Merge Sanity data (property counts + images) into static primary area definitions.
  // If Sanity hasn't been set up yet the static fallbacks provide a fully functional section.
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
    <section className="section-major" style={{ backgroundColor: 'var(--bg-canvas)' }}>
      <div
        className="mx-auto"
        style={{
          maxWidth:      'var(--content-lg)',
          paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
        }}
      >

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 'clamp(2.5rem, 4.5vw, 3.5rem)' }}>
          <div className="eyebrow-row mb-[10px]">
            <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>
              Explore Ibiza
            </span>
          </div>

          <div>
            <h2
              style={{
                color:        'var(--text-primary)',
                marginBottom: '1.375rem',
              }}
            >
              Explore Ibiza's Key Areas
            </h2>
            <p
              className="type-body"
              style={{ color: 'var(--text-secondary)', maxWidth: '620px' }}
            >
              Each part of Ibiza has its own character — from vibrant Ibiza Town
              to the peaceful landscapes of the north.
            </p>
          </div>
        </div>

        {/* ── Card Grid ────────────────────────────────────────────────── */}
        {/* Row 1 — 3 equal square cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
          <AreaCard {...c1} priority />
          <AreaCard {...c2} />
          <AreaCard {...c3} />
        </div>

        {/* Row 2 — 2 equal square cards, centred */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" style={{ maxWidth: 'calc(66.666% + 10px)', margin: '0 auto' }}>
          <AreaCard {...c4} />
          <AreaCard {...c5} />
        </div>

      </div>
    </section>
  )
}
