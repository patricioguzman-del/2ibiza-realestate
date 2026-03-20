'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { urlFor } from '../../sanity/lib/image'
import { BLUR_DARK, BLOG_CATEGORY_LABELS } from '../../lib/constants'

// Warm stone blur for light-background images
const BLUR_LIGHT =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3Crect fill='%23EBE7E0' width='4' height='3'/%3E%3C/svg%3E"

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1551038247-3d935814d94e?w=1200&h=700&fit=crop',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&h=500&fit=crop',
]

const CATEGORIES = [
  { value: 'all',           label: 'All'            },
  { value: 'market-report', label: 'Market Reports' },
  { value: 'guide',         label: 'Guides'         },
  { value: 'lifestyle',     label: 'Lifestyle'      },
  { value: 'news',          label: 'News'           },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function readTimeLabel(mins?: number): string {
  if (!mins || mins < 1) return '4 min read'
  return `${mins} min read`
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Post {
  _id:         string
  title:       string
  slug:        { current: string }
  category?:   string
  author?:     string
  publishedAt?: string
  mainImage?:  any
  excerpt?:    string
  featured?:   boolean
  readTime?:   number
}

interface Props {
  posts: Post[]
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function JournalClient({ posts }: Props) {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = useMemo(
    () =>
      activeCategory === 'all'
        ? posts
        : posts.filter((p) => p.category === activeCategory),
    [posts, activeCategory],
  )

  const [featured, ...rest] = filtered

  // Show subscribe card when grid has an orphaned slot (non-zero rest, incomplete row)
  const showSubscribeCard = rest.length > 0 && rest.length % 3 !== 0

  return (
    <>
      {/* ── Featured article ─────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: 'var(--bg-canvas)',
          paddingTop:      'clamp(2.5rem, 4vw, 3.5rem)',
          paddingBottom:   'clamp(2.5rem, 4vw, 3.5rem)',
        }}
      >
        <div
          className="mx-auto"
          style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
        >
          {featured ? (
            <Link
              href={`/blog/${featured.slug.current}`}
              className="group block no-underline"
            >
              <div
                className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden journal-card-hover"
                style={{
                  backgroundColor: 'var(--surface-primary)',
                  border:          '1px solid var(--border-muted)',
                }}
              >
                {/* Image */}
                <div
                  className="relative overflow-hidden"
                  style={{ height: 'clamp(20rem, 28vw, 30rem)' }}
                >
                  <Image
                    src={
                      featured.mainImage
                        ? urlFor(featured.mainImage).width(900).height(700).fit('crop').url()
                        : FALLBACK_IMAGES[0]
                    }
                    alt={featured.title}
                    fill
                    priority
                    placeholder="blur"
                    blurDataURL={BLUR_LIGHT}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {/* Category badge overlaid on image */}
                  {featured.category && (
                    <div
                      className="absolute top-5 left-5 type-eyebrow"
                      style={{
                        color:               'rgba(245,240,232,0.92)',
                        backgroundColor:     'rgba(47,58,55,0.52)',
                        backdropFilter:      'blur(6px)',
                        WebkitBackdropFilter:'blur(6px)',
                        padding:             '3px 10px',
                        letterSpacing:       '0.12em',
                      }}
                    >
                      {BLOG_CATEGORY_LABELS[featured.category] ?? featured.category}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div
                  className="flex flex-col justify-center"
                  style={{ padding: 'clamp(2rem, 4vw, 4rem)' }}
                >
                  {/* Meta row — author · date · read time */}
                  <div
                    className="flex items-center flex-wrap gap-x-2 gap-y-1"
                    style={{ marginBottom: '1.25rem' }}
                  >
                    {featured.author && (
                      <span className="type-caption" style={{ color: 'var(--text-tertiary)' }}>
                        {featured.author}
                      </span>
                    )}
                    {featured.author && (
                      <span style={{ color: 'var(--border-muted)' }} aria-hidden>·</span>
                    )}
                    <span className="type-caption" style={{ color: 'var(--text-tertiary)' }}>
                      {formatDate(featured.publishedAt)}
                    </span>
                    <span style={{ color: 'var(--border-muted)' }} aria-hidden>·</span>
                    <span className="type-caption" style={{ color: 'var(--accent-stone)' }}>
                      {readTimeLabel(featured.readTime)}
                    </span>
                  </div>

                  <h2
                    className="font-serif group-hover:[color:var(--accent-sea)]"
                    style={{
                      fontSize:      'clamp(1.75rem, 3vw, 2.25rem)',
                      fontWeight:    500,
                      color:         'var(--text-primary)',
                      marginBottom:  '1rem',
                      lineHeight:    1.18,
                      letterSpacing: '-0.02em',
                      transition:    'color var(--transition-ui)',
                    }}
                  >
                    {featured.title}
                  </h2>

                  <p
                    className="type-body-sm"
                    style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.75rem' }}
                  >
                    {featured.excerpt}
                  </p>

                  <span
                    className="type-btn inline-flex items-center gap-2 self-start pb-1 transition-colors duration-200 group-hover:[color:var(--cta-primary-bg)]"
                    style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--cta-primary-bg)' }}
                  >
                    Read Article
                    <span
                      className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                      aria-hidden
                    >
                      →
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <p
              className="type-body"
              style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem 0' }}
            >
              No articles in this category yet.
            </p>
          )}
        </div>
      </div>

      {/* ── Category filter + grid ────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: 'var(--bg-canvas-soft)',
          paddingTop:      'clamp(2.5rem, 4vw, 3.5rem)',
          paddingBottom:   'clamp(3rem, 5vw, 5rem)',
        }}
      >
        <div
          className="mx-auto"
          style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
        >

          {/* ── Category filter bar ──────────────────────────────────── */}
          <div
            className="flex items-center flex-wrap"
            style={{
              marginBottom: 'clamp(2rem, 4vw, 3rem)',
              borderBottom: '1px solid var(--border-muted)',
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className="type-eyebrow"
                style={{
                  background:    'none',
                  border:        'none',
                  cursor:        'pointer',
                  padding:       '8px 16px 10px',
                  letterSpacing: '0.12em',
                  color:         activeCategory === cat.value
                    ? 'var(--cta-primary-bg)'
                    : 'var(--text-secondary)',
                  borderBottom:  activeCategory === cat.value
                    ? '2px solid var(--cta-primary-bg)'
                    : '2px solid transparent',
                  marginBottom:  '-1px',
                  transition:    'color 0.2s, border-color 0.2s',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* ── Article grid ─────────────────────────────────────────── */}
          {rest.length > 0 || showSubscribeCard ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {rest.map((post, i) => {
                const imgSrc = post.mainImage
                  ? urlFor(post.mainImage).width(700).height(500).fit('crop').url()
                  : FALLBACK_IMAGES[(i + 1) % FALLBACK_IMAGES.length]

                return (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug.current}`}
                    className="group block no-underline journal-card-hover"
                    style={{
                      backgroundColor: 'var(--surface-primary)',
                      border:          '1px solid var(--border-muted)',
                      overflow:        'hidden',
                      display:         'flex',
                      flexDirection:   'column',
                    }}
                  >
                    {/* Image */}
                    <div
                      className="relative overflow-hidden"
                      style={{
                        height:          'clamp(13rem, 16vw, 16rem)',
                        backgroundColor: 'var(--bg-deep)',
                      }}
                    >
                      <Image
                        src={imgSrc}
                        alt={post.title}
                        fill
                        placeholder="blur"
                        blurDataURL={BLUR_DARK}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>

                    {/* Content */}
                    <div
                      style={{
                        padding:       '20px 24px 24px',
                        flex:          1,
                        display:       'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Category + read time */}
                      <div
                        className="flex items-center gap-2"
                        style={{ marginBottom: '10px' }}
                      >
                        {post.category && (
                          <span
                            className="type-eyebrow"
                            style={{ color: 'var(--accent-stone)', letterSpacing: '0.14em' }}
                          >
                            {BLOG_CATEGORY_LABELS[post.category] ?? post.category}
                          </span>
                        )}
                        <span style={{ color: 'var(--border-muted)' }} aria-hidden>·</span>
                        <span className="type-caption" style={{ color: 'var(--text-tertiary)' }}>
                          {readTimeLabel(post.readTime)}
                        </span>
                      </div>

                      <h3
                        className="font-serif heading-hover-sea"
                        style={{
                          fontSize:      '1.25rem',
                          fontWeight:    500,
                          color:         'var(--text-primary)',
                          lineHeight:    1.3,
                          letterSpacing: '-0.015em',
                          transition:    'color var(--transition-ui)',
                          marginBottom:  '10px',
                        }}
                      >
                        {post.title}
                      </h3>

                      <p
                        className="type-body-sm"
                        style={{
                          color:            'var(--text-secondary)',
                          lineHeight:       1.65,
                          display:          '-webkit-box',
                          WebkitLineClamp:  2,
                          WebkitBoxOrient:  'vertical' as const,
                          overflow:         'hidden',
                          marginBottom:     '1rem',
                          flex:             1,
                        }}
                      >
                        {post.excerpt}
                      </p>

                      {/* Divider */}
                      <div
                        style={{
                          height:          '1px',
                          backgroundColor: 'var(--border-muted)',
                          marginBottom:    '14px',
                        }}
                      />

                      {/* Footer — author/date + CTA */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="type-caption" style={{ color: 'var(--text-tertiary)' }}>
                          {post.author && (
                            <span>{post.author}</span>
                          )}
                          {post.author && post.publishedAt && (
                            <span style={{ opacity: 0.4, margin: '0 5px' }}>·</span>
                          )}
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                        <span
                          className="flex items-center gap-1 type-btn transition-transform duration-200 group-hover:translate-x-1"
                          style={{ color: 'var(--cta-primary-bg)', flexShrink: 0 }}
                        >
                          Read
                          <span style={{ fontSize: '13px' }}>→</span>
                        </span>
                      </div>

                    </div>
                  </Link>
                )
              })}

              {/* ── Editorial subscribe card — fills orphaned grid slot ── */}
              {showSubscribeCard && (
                <div
                  style={{
                    backgroundColor: 'var(--bg-deep)',
                    display:         'flex',
                    flexDirection:   'column',
                    justifyContent:  'center',
                    padding:         'clamp(2rem, 4vw, 3rem)',
                    minHeight:       'clamp(13rem, 16vw, 16rem)',
                  }}
                >
                  <div className="eyebrow-row mb-4">
                    <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>
                      Stay informed
                    </span>
                  </div>
                  <h3
                    className="font-serif"
                    style={{
                      color:         'var(--text-on-dark)',
                      fontWeight:    500,
                      fontSize:      'clamp(1.25rem, 2vw, 1.5rem)',
                      letterSpacing: '-0.015em',
                      lineHeight:    1.2,
                      marginBottom:  '0.875rem',
                    }}
                  >
                    Market reports, direct to your inbox.
                  </h3>
                  <p
                    className="type-body-sm"
                    style={{
                      color:         'var(--text-secondary)',
                      lineHeight:    1.75,
                      marginBottom:  '1.5rem',
                    }}
                  >
                    No noise. Just the insight that matters to Ibiza buyers.
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
                    Get in Touch
                  </Link>
                </div>
              )}

            </div>
          ) : (
            featured && (
              <p
                className="type-body"
                style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0 2rem' }}
              >
                No other articles in this category.
              </p>
            )
          )}

        </div>
      </div>
    </>
  )
}
