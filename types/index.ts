// ─── Sanity primitives ───────────────────────────────────────────────────────

export interface SanitySlug {
  current: string
}

export interface SanityImage {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  hotspot?: { x: number; y: number; height: number; width: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  alt?: string
}

// ─── Domain enums ────────────────────────────────────────────────────────────

export type PropertyStatus = 'available' | 'under-offer' | 'sold'
export type PropertyType   = 'villa' | 'finca' | 'apartment' | 'penthouse' | 'plot' | 'townhouse'

// ─── Shared area reference (used inside property objects) ────────────────────

export interface AreaRef {
  name: string
  slug?: SanitySlug
}

// ─── Property — listing shape (cards, grids, search results) ────────────────

export interface PropertyListItem {
  _id:               string
  title:             string
  slug:              SanitySlug
  status:            PropertyStatus
  exclusive?:        boolean
  price?:            number
  priceOnRequest?:   boolean
  propertyType?:     PropertyType
  beds?:             number
  baths?:            number
  sqm?:              number
  plotSqm?:          number
  area?:             AreaRef
  neighborhood?:     string
  heroImage?:        SanityImage | null
  hasTouristLicense?: boolean
  coordinates?:      { lat: number; lng: number }
  features?:         string[]
}

// ─── Property — full detail shape (single property page) ────────────────────

export interface PropertyDetail extends Omit<PropertyListItem, 'area'> {
  description?: PortableTextBlock[]
  images?:      SanityImage[]
  offMarket?:   boolean
  publishedAt?: string
  area?:        AreaRef
  related?:     PropertyListItem[]
}

// ─── Area ────────────────────────────────────────────────────────────────────

export interface Neighborhood {
  name: string
  note?: string
}

export interface Area {
  _id:            string
  name:           string
  slug:           SanitySlug
  heroImage?:     SanityImage | null
  summary?:       string
  propertyCount?: number
  description?:   PortableTextBlock[]
  galleryImages?: SanityImage[]
  neighborhoods?: Neighborhood[]
  properties?:    PropertyListItem[]
}

// ─── Blog post ───────────────────────────────────────────────────────────────

export interface BlogPost {
  _id:          string
  title:        string
  slug:         SanitySlug
  category?:    string
  author?:      string
  publishedAt?: string
  mainImage?:   SanityImage | null
  excerpt?:     string
  featured?:    boolean
  body?:        PortableTextBlock[]
}

// ─── Team member ─────────────────────────────────────────────────────────────

export interface TeamMember {
  _id:        string
  name:       string
  role?:      string
  photo?:     SanityImage | null
  bio?:       string
  languages?: string[]
  email?:     string
}

// ─── PortableText ─────────────────────────────────────────────────────────────

// Satisfies @portabletext/types TypedObject — _type is required.
export type PortableTextBlock = { _type: string } & Record<string, unknown>
