import nextDynamic from 'next/dynamic'
import { client } from '../../sanity/lib/client'
import { featuredPropertiesQuery, allAreasQuery } from '../../sanity/lib/queries'
import Hero from '../../components/home/Hero'
import TrustSection from '../../components/home/TrustSection'
import PropertySearch from '../../components/home/PropertySearch'
import FeaturedListings from '../../components/home/FeaturedListings'
import EditorialBreak from '../../components/home/EditorialBreak'
import AreasGrid from '../../components/home/AreasGrid'
import WhySection from '../../components/home/WhySection'
import ClientQuote from '../../components/home/ClientQuote'
import MarketIntelligence from '../../components/home/MarketIntelligence'
import ScrollReveal from '../../components/ui/ScrollReveal'
import ErrorBoundary from '../../components/ui/ErrorBoundary'

// Code-split below-fold interactive sections — not needed for initial paint
const ValuationCTA = nextDynamic(() => import('../../components/home/ValuationCTA'))
const Newsletter   = nextDynamic(() => import('../../components/home/Newsletter'))

// Always render fresh — prevents stale Sanity content being served from
// Next.js fetch cache after publishing new documents in the Studio.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [properties, areas] = await Promise.all([
    client.fetch(featuredPropertiesQuery).catch(() => []),
    client.fetch(allAreasQuery).catch(() => []),
  ])

  return (
    <>
      {/* 1. Hero — above the fold, no reveal delay */}
      <ErrorBoundary>
        <Hero />
      </ErrorBoundary>

      {/* 2. Trust / credibility — immediate follow-up to the hero */}
      <ErrorBoundary>
        <TrustSection />
      </ErrorBoundary>

      {/* 3. Search module */}
      <ErrorBoundary>
        <PropertySearch />
      </ErrorBoundary>

      {/* 3–8. Below-fold sections get scroll-triggered fade-up entrance */}
      <ErrorBoundary>
        <ScrollReveal>
          <FeaturedListings properties={properties} />
        </ScrollReveal>
      </ErrorBoundary>

      <ErrorBoundary>
        <EditorialBreak />
      </ErrorBoundary>

      <ErrorBoundary>
        <ScrollReveal delay={60}>
          <AreasGrid areas={areas} />
        </ScrollReveal>
      </ErrorBoundary>

      <ErrorBoundary>
        <ScrollReveal delay={40}>
          <WhySection />
        </ScrollReveal>
      </ErrorBoundary>

      <ErrorBoundary>
        <ScrollReveal delay={40}>
          <ClientQuote />
        </ScrollReveal>
      </ErrorBoundary>

      <ErrorBoundary>
        <ScrollReveal delay={40}>
          <MarketIntelligence />
        </ScrollReveal>
      </ErrorBoundary>

      <ErrorBoundary>
        <ScrollReveal delay={40}>
          <ValuationCTA />
        </ScrollReveal>
      </ErrorBoundary>

      <ErrorBoundary>
        <ScrollReveal delay={40}>
          <Newsletter />
        </ScrollReveal>
      </ErrorBoundary>
    </>
  )
}
