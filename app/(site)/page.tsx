import nextDynamic from 'next/dynamic'
import { client } from '../../sanity/lib/client'
import { featuredPropertiesQuery, allAreasQuery, featuredBlogPostsQuery } from '../../sanity/lib/queries'
import Hero from '../../components/home/Hero'
import FeaturedListings from '../../components/home/FeaturedListings'
import AreasGrid from '../../components/home/AreasGrid'
import WhySection from '../../components/home/WhySection'
import BlogPreview from '../../components/home/BlogPreview'
import ScrollReveal from '../../components/ui/ScrollReveal'
import ErrorBoundary from '../../components/ui/ErrorBoundary'

// Code-split below-fold interactive section — not needed for initial paint
const ValuationCTA = nextDynamic(() => import('../../components/home/ValuationCTA'))

// Always render fresh — prevents stale Sanity content being served from
// Next.js fetch cache after publishing new documents in the Studio.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [properties, areas, posts] = await Promise.all([
    client.fetch(featuredPropertiesQuery).catch(() => []),
    client.fetch(allAreasQuery).catch(() => []),
    client.fetch(featuredBlogPostsQuery).catch(() => []),
  ])

  return (
    <>
      {/* 1. Hero — above the fold, integrated search panel */}
      <ErrorBoundary>
        <Hero />
      </ErrorBoundary>

      {/* 2. Featured listings */}
      <ErrorBoundary>
        <ScrollReveal>
          <FeaturedListings properties={properties} />
        </ScrollReveal>
      </ErrorBoundary>

      {/* 3. Areas — asymmetric masonry */}
      <ErrorBoundary>
        <ScrollReveal delay={60}>
          <AreasGrid areas={areas} />
        </ScrollReveal>
      </ErrorBoundary>

      {/* 4. Why 2ibiza + client testimonial */}
      <ErrorBoundary>
        <ScrollReveal delay={40}>
          <WhySection />
        </ScrollReveal>
      </ErrorBoundary>

      {/* 5. Market insights + blog preview */}
      <ErrorBoundary>
        <ScrollReveal delay={40}>
          <BlogPreview posts={posts} />
        </ScrollReveal>
      </ErrorBoundary>

      {/* 6. Valuation CTA — closing conversion */}
      <ErrorBoundary>
        <ScrollReveal delay={40}>
          <ValuationCTA />
        </ScrollReveal>
      </ErrorBoundary>
    </>
  )
}
