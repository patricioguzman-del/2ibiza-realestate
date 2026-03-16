import Image from 'next/image'
import Link from 'next/link'
import { client } from '../../../sanity/lib/client'
import { allBlogPostsQuery } from '../../../sanity/lib/queries'
import { urlFor } from '../../../sanity/lib/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Journal — Ibiza Real Estate Insights',
  description: 'Market reports, buying guides, lifestyle features and news from the Ibiza property market.',
}

export const revalidate = 60

const CATEGORY_LABELS: Record<string, string> = {
  'market-report': 'Market Report',
  'guide': 'Guide',
  'news': 'News',
  'lifestyle': 'Lifestyle',
}

const FALLBACK_POSTS = [
  { _id: '1', title: 'The Ibiza Property Market: 2024 in Review', slug: { current: 'ibiza-market-2024' }, category: 'market-report', author: 'The 2ibiza Team', publishedAt: '2024-01-15T00:00:00Z', mainImage: null, excerpt: "An in-depth look at how the island's luxury market performed — and what buyers can expect in the year ahead.", featured: true },
  { _id: '2', title: "Why Santa Gertrudis is Ibiza's Most Sought-After Village", slug: { current: 'santa-gertrudis-guide' }, category: 'guide', author: 'The 2ibiza Team', publishedAt: '2024-01-08T00:00:00Z', mainImage: null, excerpt: 'From its bohemian art scene to the finest fincas, we explore what makes this inland village so special.' },
  { _id: '3', title: 'Understanding Tourist Licenses in Ibiza', slug: { current: 'tourist-licenses-ibiza' }, category: 'guide', author: 'The 2ibiza Team', publishedAt: '2023-12-20T00:00:00Z', mainImage: null, excerpt: 'Everything you need to know about the ETV license — and whether the property you want has one.' },
  { _id: '4', title: 'The Best Areas to Buy in Ibiza for 2024', slug: { current: 'best-areas-2024' }, category: 'guide', author: 'The 2ibiza Team', publishedAt: '2023-12-01T00:00:00Z', mainImage: null, excerpt: 'From the hills of San José to the marinas of Santa Eulalia — a guide to where to buy.' },
  { _id: '5', title: 'Ibiza in Winter: The Island Beyond the Season', slug: { current: 'ibiza-in-winter' }, category: 'lifestyle', author: 'The 2ibiza Team', publishedAt: '2023-11-15T00:00:00Z', mainImage: null, excerpt: 'The real Ibiza reveals itself in the off-season. Here\'s why many of our buyers choose to spend the winter here.' },
]

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1551038247-3d935814d94e?w=1200&h=700&fit=crop',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&h=500&fit=crop',
]

export default async function BlogPage() {
  const posts = await client.fetch(allBlogPostsQuery).catch(() => [])
  const displayPosts = posts.length ? posts : FALLBACK_POSTS

  const [featured, ...rest] = displayPosts

  return (
    <>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--bg-deep)', paddingTop: 'clamp(6rem, 10vw, 8rem)', paddingBottom: 'clamp(3rem, 5vw, 4rem)' }}>
        <div className="mx-auto" style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}>
          <div className="eyebrow-row mb-[10px]">
            <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>Insights & Guides</span>
          </div>
          <h1 className="font-serif" style={{ color: 'var(--text-on-dark)', fontWeight: 400, marginTop: '12px' }}>The Journal</h1>
        </div>
      </div>

      <div className="section-major" style={{ backgroundColor: 'var(--bg-canvas-soft)' }}>
        <div className="mx-auto" style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}>
          {/* Featured Article */}
          {featured && (
            <Link href={`/blog/${featured.slug.current}`} className="group block no-underline mb-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden journal-card-hover" style={{ backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-muted)' }}>
                <div className="relative h-72 lg:h-96 overflow-hidden">
                  <Image
                    src={featured.mainImage ? urlFor(featured.mainImage).width(900).height(600).url() : FALLBACK_IMAGES[0]}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="p-10 lg:p-16 flex flex-col justify-center">
                  <span className="type-eyebrow mb-4" style={{ color: 'var(--accent-stone)' }}>
                    {CATEGORY_LABELS[featured.category] || featured.category}
                  </span>
                  <h2
                    className="font-serif group-hover:[color:var(--accent-sea)]"
                    style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.18, transition: 'color var(--transition-ui)' }}
                  >
                    {featured.title}
                  </h2>
                  <p className="type-body-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{featured.excerpt}</p>
                  <div className="flex items-center gap-4 type-caption" style={{ color: 'var(--text-tertiary)' }}>
                    <span>{featured.author}</span>
                    <span>·</span>
                    <span>{featured.publishedAt ? new Date(featured.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>
                  </div>
                  <span
                    className="mt-6 type-btn inline-block self-start pb-1 transition-colors duration-200 group-hover:[color:var(--cta-primary-bg)]"
                    style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--cta-primary-bg)' }}
                  >
                    Read Article →
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((post: any, i: number) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="group block no-underline journal-card-hover"
                style={{ backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-muted)', overflow: 'hidden' }}
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={post.mainImage ? urlFor(post.mainImage).width(600).height(400).url() : FALLBACK_IMAGES[(i + 1) % FALLBACK_IMAGES.length]}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>
                    {CATEGORY_LABELS[post.category] || post.category}
                  </span>
                  <h3
                    className="font-serif group-hover:[color:var(--accent-sea)] mt-2 mb-3"
                    style={{ fontSize: '1.25rem', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.3, transition: 'color var(--transition-ui)' }}
                  >
                    {post.title}
                  </h3>
                  <p className="type-body-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>
                  <div className="mt-4 pt-4 type-caption" style={{ borderTop: '1px solid var(--border-muted)', color: 'var(--text-tertiary)' }}>
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
