import { groq } from 'next-sanity'

export const featuredPropertiesQuery = groq`
  *[_type == "property" && featured == true] | order(publishedAt desc)[0...6] {
    _id, title, slug, status, exclusive,
    price, priceOnRequest, propertyType,
    beds, baths, sqm, plotSqm,
    area->{ name, slug },
    neighborhood,
    "heroImage": images[0],
    hasTouristLicense
  }
`

export const allPropertiesQuery = groq`
  *[_type == "property"] | order(publishedAt desc) {
    _id, title, slug, status, exclusive,
    price, priceOnRequest, propertyType,
    beds, baths, sqm, plotSqm,
    area->{ name, slug },
    neighborhood,
    "heroImage": images[0],
    hasTouristLicense,
    coordinates,
    features
  }
`

export const propertyBySlugQuery = groq`
  *[_type == "property" && slug.current == $slug][0] {
    _id, title, slug, status, exclusive,
    price, priceOnRequest, propertyType,
    beds, baths, sqm, plotSqm,
    description,
    features,
    images,
    hasTouristLicense, offMarket,
    publishedAt,
    area->{ name, slug },
    coordinates
  }
`

/** Fetches full property detail + related properties in a single request. */
export const propertyDetailQuery = groq`
  *[_type == "property" && slug.current == $slug][0] {
    _id, title, slug, status, exclusive,
    price, priceOnRequest, propertyType,
    beds, baths, sqm, plotSqm,
    description,
    features,
    images,
    hasTouristLicense, offMarket,
    publishedAt,
    area->{ name, slug, summary },
    neighborhood,
    coordinates,
    "related": *[_type == "property" && area._ref == ^.area._ref && slug.current != $slug] | order(publishedAt desc)[0...3] {
      _id, title, slug, status, exclusive,
      price, priceOnRequest, propertyType,
      beds, baths, sqm,
      area->{ name, slug },
      neighborhood,
      "heroImage": images[0]
    }
  }
`

export const relatedPropertiesQuery = groq`
  *[_type == "property" && area->slug.current == $areaSlug && slug.current != $currentSlug] | order(publishedAt desc)[0...3] {
    _id, title, slug, status, exclusive,
    price, priceOnRequest, propertyType,
    beds, baths, sqm,
    area->{ name, slug },
    "heroImage": images[0]
  }
`

export const featuredBlogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc)[0...3] {
    _id, title, slug, category,
    author, publishedAt,
    mainImage, excerpt,
    featured
  }
`

export const allBlogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id, title, slug, category,
    author, publishedAt,
    mainImage, excerpt,
    featured,
    "readTime": round(length(pt::text(body)) / 200)
  }
`

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id, title, slug, category,
    author, publishedAt,
    mainImage, excerpt,
    body
  }
`

export const allAreasQuery = groq`
  *[_type == "area"] | order(name asc) {
    _id, name, slug,
    heroImage, summary,
    "propertyCount": count(*[_type == "property" && references(^._id)])
  }
`

export const areaBySlugQuery = groq`
  *[_type == "area" && slug.current == $slug][0] {
    _id, name, slug,
    description, heroImage, galleryImages, summary,
    neighborhoods[] { name, note },
    "properties": *[_type == "property" && area._ref == ^._id] | order(publishedAt desc) {
      _id, title, slug, status, price, priceOnRequest,
      propertyType, beds, baths, sqm, exclusive,
      "heroImage": images[0]
    }
  }
`

export const teamMembersQuery = groq`
  *[_type == "teamMember"] | order(_createdAt asc) {
    _id, name, role, photo, bio, languages, email
  }
`

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    phone, email, address, whatsapp, socialLinks,
    "featuredProperties": featuredProperties[]->{
      _id, title, slug, price, priceOnRequest, propertyType,
      beds, baths, sqm, exclusive,
      area->{ name, slug },
      "heroImage": images[0]
    }
  }
`
