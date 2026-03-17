import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '../../sanity/lib/image'

const BLUR_STONE = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 3 2\'%3E%3Crect fill=\'%23EBE7E0\' width=\'3\' height=\'2\'/%3E%3C/svg%3E'

// ─── Types ─────────────────────────────────────────────────────────────────

interface BlogPreviewProps {
  posts: any[]
}

// ─── Fallback blog posts ────────────────────────────────────────────────────

const FALLBACK = [
  {
    _id:         '1',
    title:       'Ibiza Property Market Outlook 2026',
    slug:        { current: 'ibiza-market-outlook-2026' },
    category:    'market-report',
    publishedAt: '2026-03-01T00:00:00Z',
    mainImage:   null,
    excerpt:
      'An analysis of pricing trends, buyer demand and emerging opportunities across the island as the market enters a new cycle.',
  },
  {
    _id:         '2',
    title:       'Understanding Tourist Licenses in Ibiza',
    slug:        { current: 'tourist-licenses-ibiza' },
    category:    'guide',
    publishedAt: '2026-02-12T00:00:00Z',
    mainImage:   null,
    excerpt:     null,
  },
  {
    _id:         '3',
    title:       'Where Families Choose to Live in Ibiza',
    slug:        { current: 'family-living-ibiza' },
    category:    'lifestyle',
    publishedAt: '2026-01-28T00:00:00Z',
    mainImage:   null,
    excerpt:     null,
  },
]

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=750&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
]

const CATS: Record<string, string> = {
  'market-report': 'Market Report',
  'guide':         'Guide',
  'news':          'News',
  'lifestyle':     'Lifestyle',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function BlogPreview({ posts }: BlogPreviewProps) {
  const display    = (posts?.length ? posts : FALLBACK).slice(0, 3)
  const [featured, ...secondary] = display

  return (
    <section
      className="section-major"
      style={{ backgroundColor: 'var(--bg-canvas-soft)', paddingBottom: 'clamp(52px, 6vw, 80px)' }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
      >

        {/* ── Section Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
          <div>
            <div className="eyebrow-row mb-[10px]">
              <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>
                Market Insights
              </span>
            </div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '22px' }}>
              Understanding the Ibiza<br className="hidden sm:block" /> property market.
            </h2>
            <p
              className="type-body-sm"
              style={{
                color:        'var(--text-secondary)',
                lineHeight:   1.7,
                maxWidth:     '440px',
                marginBottom: 0,
              }}
            >
              Insights, guides and market perspectives to help you navigate
              Ibiza real estate with confidence.
            </p>
          </div>

          <Link href="/blog" className="section-more-link shrink-0">
            View All Articles
            <span className="block h-px bg-current" style={{ width: '24px' }} />
          </Link>
        </div>

        {/* ── Article Grid ────────────────────────────────────────────────── */}
        {/*
          Desktop: 5-column grid
            Featured article — left, col-span-3 (60%)
            Secondary stack  — right, col-span-2 (40%)
          Tablet/mobile: single column, featured first
        */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* ── Featured article ──────────────────────────────────── */}
          {featured && (
            <Link
              href={`/blog/${featured.slug.current}`}
              className="group block no-underline lg:col-span-3 journal-card-hover"
              style={{
                backgroundColor: 'var(--surface-primary)',
                border:          '1px solid var(--border-muted)',
              }}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: '3/2' }}>
                <Image
                  src={
                    featured.mainImage
                      ? urlFor(featured.mainImage).width(1200).height(800).fit('crop').url()
                      : FALLBACK_IMGS[0]
                  }
                  alt={featured.title}
                  fill
                  priority
                  placeholder="blur"
                  blurDataURL={BLUR_STONE}
                  className="object-cover object-[center_40%] transition-transform duration-200 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>

              <div style={{ padding: 'clamp(24px, 3vw, 36px)' }}>
                <span
                  className="type-eyebrow block mb-4"
                  style={{ color: 'var(--accent-stone)' }}
                >
                  {CATS[featured.category] || featured.category}
                </span>

                <h3
                  className="font-serif heading-hover-sea"
                  style={{
                    fontSize:      'clamp(1.625rem, 2.4vw, 2.125rem)',
                    fontWeight:    500,
                    lineHeight:    1.15,
                    letterSpacing: '-0.018em',
                    marginBottom:  '18px',
                  }}
                >
                  {featured.title}
                </h3>

                {featured.excerpt && (
                  <p
                    className="type-body"
                    style={{
                      color:        'var(--text-secondary)',
                      lineHeight:   1.72,
                      maxWidth:     '52ch',
                      marginBottom: '24px',
                    }}
                  >
                    {featured.excerpt}
                  </p>
                )}

                <div
                  className="flex items-center justify-between pt-5"
                  style={{ borderTop: '1px solid var(--border-muted)' }}
                >
                  <span className="type-caption" style={{ color: 'var(--text-tertiary)' }}>
                    {featured.publishedAt ? formatDate(featured.publishedAt) : ''}
                  </span>
                  <span
                    className="type-caption flex items-center"
                    style={{ gap: '5px', color: 'var(--text-primary)' }}
                  >
                    Read Article
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* ── Secondary articles — stacked right ────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-8 lg:gap-10">
            {secondary.slice(0, 2).map((post, i) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="group block no-underline journal-card-hover"
                style={{
                  backgroundColor: 'var(--surface-primary)',
                  border:          '1px solid var(--border-muted)',
                }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '3/2' }}>
                  <Image
                    src={
                      post.mainImage
                        ? urlFor(post.mainImage).width(800).height(533).fit('crop').url()
                        : FALLBACK_IMGS[i + 1]
                    }
                    alt={post.title}
                    fill
                    placeholder="blur"
                    blurDataURL={BLUR_STONE}
                    className="object-cover object-[center_40%] transition-transform duration-200 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>

                <div style={{ padding: 'clamp(20px, 2vw, 24px)' }}>
                  <span
                    className="type-eyebrow block mb-3"
                    style={{ color: 'var(--accent-stone)' }}
                  >
                    {CATS[post.category] || post.category}
                  </span>

                  <h4
                    className="font-serif heading-hover-sea"
                    style={{
                      fontSize:      'clamp(1.125rem, 1.5vw, 1.3125rem)',
                      fontWeight:    500,
                      lineHeight:    1.25,
                      letterSpacing: '-0.012em',
                      marginBottom:  '14px',
                    }}
                  >
                    {post.title}
                  </h4>

                  <span className="type-caption" style={{ color: 'var(--text-tertiary)' }}>
                    {post.publishedAt ? formatDate(post.publishedAt) : ''}
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>


      </div>
    </section>
  )
}
