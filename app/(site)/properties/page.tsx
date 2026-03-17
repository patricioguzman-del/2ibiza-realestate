import { Suspense } from 'react'
import { client } from '../../../sanity/lib/client'
import { allPropertiesQuery, allAreasQuery } from '../../../sanity/lib/queries'
import PropertiesClient from '../../../components/property/PropertiesClient'
import PageHeader from '../../../components/ui/PageHeader'
import ContentContainer from '../../../components/ui/ContentContainer'
import { SkeletonGrid } from '../../../components/ui/SkeletonCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Properties for Sale in Ibiza',
  description: 'Browse our full collection of luxury villas, fincas, apartments and penthouses for sale in Ibiza.',
}

export const revalidate = 60

export default async function PropertiesPage() {
  const [properties, areas] = await Promise.all([
    client.fetch(allPropertiesQuery).catch(() => []),
    client.fetch(allAreasQuery).catch(() => []),
  ])

  return (
    <>
      <PageHeader
        eyebrow="Our Portfolio"
        title="Properties"
        subtitle="A curated collection of villas, fincas, apartments and penthouses across Ibiza's finest locations."
      />

      <Suspense
        fallback={
          <div style={{ backgroundColor: 'var(--bg-canvas-soft)', paddingBlock: 'clamp(4.5rem, 8vw, 7.5rem)' }}>
            <ContentContainer>
              <SkeletonGrid count={6} />
            </ContentContainer>
          </div>
        }
      >
        <PropertiesClient initialProperties={properties} areas={areas} />
      </Suspense>
    </>
  )
}
