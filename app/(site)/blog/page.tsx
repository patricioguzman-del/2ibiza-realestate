import Link from 'next/link'
import { client } from '../../../sanity/lib/client'
import { allBlogPostsQuery } from '../../../sanity/lib/queries'
import { CONTACT } from '../../../lib/constants'
import JournalClient from '../../../components/journal/JournalClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Journal — Ibiza Real Estate Insights',
  description:
    'Market reports, buying guides, lifestyle features and news from the Ibiza property market.',
}

export const revalidate = 60

// ─── Fallback data ────────────────────────────────────────────────────────────

const FALLBACK_POSTS = [
  {
    _id: '1',
    title: 'Ibiza Luxury Property Market 2026: What Buyers Need to Know',
    slug: { current: 'ibiza-market-2026' },
    category: 'market-report',
    author: '2ibiza Team',
    publishedAt: '2026-03-10T00:00:00Z',
    mainImage: null,
    excerpt:
      'Demand for prime Ibiza property continues to outpace supply. We break down pricing trends, the most active buyer profiles, and which areas are seeing the strongest growth heading into 2026.',
    featured: true,
    readTime: 6,
  },
  {
    _id: '2',
    title: 'San José vs Santa Eulalia: Which Area Is Right for You?',
    slug: { current: 'san-jose-vs-santa-eulalia' },
    category: 'guide',
    author: '2ibiza Team',
    publishedAt: '2026-03-01T00:00:00Z',
    mainImage: null,
    excerpt:
      "Two of Ibiza's most desirable areas, two very different lifestyles. We compare the property markets, beaches and communities to help you choose.",
    readTime: 5,
  },
  {
    _id: '3',
    title: 'The Complete Guide to Buying Property in Ibiza',
    slug: { current: 'buying-guide-ibiza' },
    category: 'guide',
    author: '2ibiza Team',
    publishedAt: '2026-02-20T00:00:00Z',
    mainImage: null,
    excerpt:
      'From NIE numbers to notary fees — everything you need to know before purchasing property on the island.',
    readTime: 8,
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPage() {
  const posts = await client.fetch(allBlogPostsQuery).catch(() => [])
  const displayPosts = posts.length ? posts : FALLBACK_POSTS

  return (
    <>
      {/* ── Fix #1: Richer page header ───────────────────────────────────── */}
      <div
        style={{
          backgroundColor: 'var(--bg-deep)',
          paddingTop:      'clamp(6rem, 10vw, 9rem)',
          paddingBottom:   'clamp(3.5rem, 6vw, 5rem)',
          // Softens the dark→light cut
          borderBottom:    '1px solid rgba(245,240,232,0.06)',
        }}
      >
        <div
          className="mx-auto"
          style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
        >
          <div className="eyebrow-row mb-[10px]">
            <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>
              Insights &amp; Guides
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
            The Journal
          </h1>
          <p
            className="type-body"
            style={{ color: 'rgba(245,240,232,0.72)', maxWidth: '58ch', lineHeight: 1.8 }}
          >
            Market intelligence, area guides and lifestyle perspectives from the team
            that knows Ibiza. Written for buyers who want to understand the island
            before they invest in it.
          </p>
        </div>
      </div>

      {/* ── Fix #2–#13: Interactive content (client component) ───────────── */}
      {/* Handles: priority image, blurDataURL, category filter, grid cards     */}
      {/* with author/readTime/CTA, orphan subscribe card, section rhythm       */}
      <JournalClient posts={displayPosts} />

      {/* ── Fix #8: Closing conversion section ──────────────────────────── */}
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
                  Ready to take the next step?
                </span>
              </div>
              <h2
                className="font-serif"
                style={{
                  color:        'var(--text-on-dark)',
                  fontWeight:   500,
                  lineHeight:   1.05,
                  marginBottom: '18px',
                }}
              >
                Talk to an advisor<br />who knows the market.
              </h2>
              <p
                className="type-body-sm"
                style={{ color: 'rgba(245,240,232,0.65)', lineHeight: 1.8, marginBottom: 0 }}
              >
                Our team has advised buyers across every area and price point on
                the island. Whatever stage you&apos;re at, we can help you make
                sense of it.
              </p>
            </div>

            <div
              className="flex flex-col sm:flex-row lg:flex-col gap-3"
              style={{ flexShrink: 0 }}
            >
              <Link href="/properties" className="btn-primary">
                Browse Properties
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
