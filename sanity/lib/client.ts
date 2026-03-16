import { createClient } from 'next-sanity'

const isDev = process.env.NODE_ENV !== 'production'

export const client = createClient({
  projectId:   process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset:     process.env.NEXT_PUBLIC_SANITY_DATASET    || 'production',
  apiVersion:  '2024-01-01',
  // CDN only in production — dev always hits the API directly so published
  // changes appear immediately without stale cache responses.
  useCdn:      !isDev,
  // Token enables reading draft documents in development.
  // In production this is undefined and only published content is served.
  token:       isDev ? process.env.SANITY_API_TOKEN : undefined,
  // In dev, overlay drafts over published so Studio changes appear without
  // needing to hit Publish each time.
  perspective: isDev ? 'drafts' : 'published',
})
