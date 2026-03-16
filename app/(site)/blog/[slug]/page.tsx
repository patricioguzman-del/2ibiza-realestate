import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { client } from '../../../../sanity/lib/client'
import { blogPostBySlugQuery, allBlogPostsQuery } from '../../../../sanity/lib/queries'
import { urlFor } from '../../../../sanity/lib/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { BlogPost } from '../../../../types'
import { BLOG_CATEGORY_LABELS } from '../../../../lib/constants'

export const revalidate = 60

export async function generateStaticParams() {
  const posts: BlogPost[] = await client.fetch(allBlogPostsQuery).catch(() => [])
  return posts.map(p => ({ slug: p.slug.current }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post: BlogPost | null = await client.fetch(blogPostBySlugQuery, { slug }).catch(() => null)
  if (!post) return { title: 'Article Not Found' }
  const ogImage = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).fit('crop').url()
    : undefined
  return {
    title:       post.title,
    description: post.excerpt,
    openGraph: {
      title:       post.title,
      description: post.excerpt,
      type:        'article',
      ...(post.publishedAt && { publishedTime: post.publishedAt }),
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }] }),
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post: BlogPost | null = await client.fetch(blogPostBySlugQuery, { slug }).catch(() => null)
  if (!post) notFound()

  const heroUrl = post.mainImage
    ? urlFor(post.mainImage).width(1920).height(1080).fit('crop').url()  // 16:9
    : 'https://images.unsplash.com/photo-1551038247-3d935814d94e?w=1920&h=1080&fit=crop'

  return (
    <>
      {/* ── Hero — 16:9 cinematic with dual-axis overlay ─────────── */}
      <div className="relative" style={{ height: '62vh', minHeight: '440px' }}>
        <Image
          src={heroUrl}
          alt={post.title}
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
              'linear-gradient(to top, rgba(47,58,55,0.86) 0%, rgba(47,58,55,0.16) 58%, transparent 100%)',
          }}
        />
        {/* Left directional — readability for long titles */}
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
          <div className="mx-auto" style={{ maxWidth: 'var(--content-sm)' }}>
            <div className="eyebrow-row mb-3">
              <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>
                {(post.category && BLOG_CATEGORY_LABELS[post.category]) || post.category}
              </span>
            </div>
            <h1
              className="font-serif"
              style={{
                color:         'var(--text-on-dark)',
                fontWeight:    400,
                letterSpacing: '-0.025em',
                fontSize:      'clamp(2rem, 4vw, 3.5rem)',
                lineHeight:    1.05,
              }}
            >
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Meta bar ─────────────────────────────────────────────── */}
      <div style={{ backgroundColor: 'var(--surface-primary)', borderBottom: '1px solid var(--border-muted)' }}>
        <div
          className="mx-auto flex flex-wrap items-center gap-6"
          style={{
            maxWidth: 'var(--content-sm)',
            paddingInline: 'clamp(1.5rem, 4vw, 4rem)',
            paddingBlock: '1rem',
          }}
        >
          {post.author && (
            <span className="type-body-sm" style={{ color: 'var(--text-secondary)' }}>
              By {post.author}
            </span>
          )}
          {post.publishedAt && (
            <span className="type-body-sm" style={{ color: 'var(--text-tertiary)' }}>
              {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          )}
          <Link
            href="/blog"
            className="ml-auto type-btn hover-on-light-gold"
            style={{ color: 'var(--text-primary)' }}
          >
            ← Back to Journal
          </Link>
        </div>
      </div>

      {/* ── Article Body ─────────────────────────────────────────── */}
      <div style={{ backgroundColor: 'var(--bg-canvas)', paddingBlock: 'clamp(3.5rem, 7vw, 6rem)' }}>
        <div
          className="mx-auto"
          style={{ maxWidth: 'var(--content-sm)', paddingInline: 'clamp(1.5rem, 4vw, 4rem)' }}
        >
          {post.excerpt && (
            <p
              className="font-serif"
              style={{
                fontSize:      'clamp(1.125rem, 2vw, 1.375rem)',
                color:         'var(--text-primary)',
                opacity:       0.72,
                lineHeight:    1.65,
                marginBottom:  'clamp(2rem, 4vw, 3rem)',
                borderLeft:    '3px solid var(--cta-primary-bg)',
                paddingLeft:   '1.5rem',
              }}
            >
              {post.excerpt}
            </p>
          )}
          {post.body && (
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-light prose-a:no-underline prose-strong:font-medium">
              <PortableText value={post.body} />
            </div>
          )}

          {/* ── CTA ────────────────────────────────────────────── */}
          <div
            className="text-center"
            style={{
              marginTop:       'clamp(3rem, 6vw, 5rem)',
              padding:         'clamp(2rem, 4vw, 3rem)',
              backgroundColor: 'var(--bg-deep)',
            }}
          >
            <h3
              className="font-serif"
              style={{
                color:        'var(--text-on-dark)',
                fontWeight:   400,
                marginBottom: '0.75rem',
                fontSize:     'clamp(1.375rem, 2.5vw, 1.75rem)',
              }}
            >
              Looking for a property in Ibiza?
            </h3>
            <p
              className="type-body-sm"
              style={{ color: 'rgba(245,240,232,0.76)', marginBottom: '1.75rem' }}
            >
              Browse our curated collection of villas, fincas and apartments.
            </p>
            <Link href="/properties" className="btn-primary">
              View Properties →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
