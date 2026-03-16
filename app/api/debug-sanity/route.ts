import { NextResponse } from 'next/server'
import { client } from '../../../sanity/lib/client'
import { featuredPropertiesQuery } from '../../../sanity/lib/queries'

export const dynamic = 'force-dynamic'

export async function GET() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET

  let properties: unknown = null
  let error: string | null = null

  try {
    properties = await client.fetch(featuredPropertiesQuery)
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json({
    env: { projectId, dataset },
    count: Array.isArray(properties) ? properties.length : null,
    properties,
    error,
  })
}
