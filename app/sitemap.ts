import type { MetadataRoute } from 'next'
import { client } from '../sanity/lib/client'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.2ibiza.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, posts, areas] = await Promise.all([
    client.fetch<{ slug: { current: string }; publishedAt?: string }[]>(
      `*[_type == "property" && defined(slug.current)]{ slug, publishedAt }`
    ).catch(() => []),
    client.fetch<{ slug: { current: string }; publishedAt?: string }[]>(
      `*[_type == "blogPost" && defined(slug.current)]{ slug, publishedAt }`
    ).catch(() => []),
    client.fetch<{ slug: { current: string } }[]>(
      `*[_type == "area" && defined(slug.current)]{ slug }`
    ).catch(() => []),
  ])

  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                      lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/properties`,      lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/areas`,           lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/blog`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/about`,           lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${BASE}/contact`,         lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${BASE}/sell`,            lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
  ]

  const propertyRoutes: MetadataRoute.Sitemap = properties.map(p => ({
    url:             `${BASE}/properties/${p.slug.current}`,
    lastModified:    p.publishedAt ? new Date(p.publishedAt) : now,
    changeFrequency: 'weekly',
    priority:        0.9,
  }))

  const areaRoutes: MetadataRoute.Sitemap = areas.map(a => ({
    url:             `${BASE}/areas/${a.slug.current}`,
    lastModified:    now,
    changeFrequency: 'monthly',
    priority:        0.7,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map(p => ({
    url:             `${BASE}/blog/${p.slug.current}`,
    lastModified:    p.publishedAt ? new Date(p.publishedAt) : now,
    changeFrequency: 'monthly',
    priority:        0.7,
  }))

  return [...staticRoutes, ...propertyRoutes, ...areaRoutes, ...postRoutes]
}
