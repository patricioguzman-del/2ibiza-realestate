import Link from 'next/link'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { client } from '../../../../sanity/lib/client'
import { propertyDetailQuery, allPropertiesQuery } from '../../../../sanity/lib/queries'
import { urlFor } from '../../../../sanity/lib/image'
import { PortableText } from '@portabletext/react'
import PropertyCard from '../../../../components/property/PropertyCard'
import EnquiryForm from '../../../../components/property/EnquiryForm'
import { propertyPtComponents } from '../../../../components/portable-text/PropertyPortableText'
import type { Metadata } from 'next'
import type { PropertyDetail, PropertyListItem } from '../../../../types'

// Code-split the gallery components — they are large and only needed after images load
const PropertyHeroGallery = dynamic(
  () => import('../../../../components/property/PropertyHeroGallery'),
  {
    loading: () => (
      <div style={{ height: 'clamp(320px, 55vh, 640px)', backgroundColor: 'var(--bg-deep)' }} />
    ),
  }
)

const PropertyGallery = dynamic(
  () => import('../../../../components/property/PropertyGallery')
)

export const revalidate = 60

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const properties: PropertyListItem[] = await client.fetch(allPropertiesQuery).catch(() => [])
  return properties.map(p => ({ slug: p.slug.current }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const property: PropertyDetail | null = await client.fetch(propertyDetailQuery, { slug }).catch(() => null)
  if (!property) return { title: 'Property Not Found' }
  const description = `${property.propertyType ? property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) : 'Property'} in ${property.area?.name || 'Ibiza'}${property.beds ? ` — ${property.beds} bedrooms` : ''}${property.sqm ? `, ${property.sqm}m²` : ''}.`
  const ogImage = property.images?.[0]
    ? urlFor(property.images[0]).width(1200).height(630).fit('crop').url()
    : undefined
  return {
    title:       property.title,
    description,
    openGraph: {
      title:       property.title,
      description,
      type:        'website',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: property.title }] }),
    },
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price?: number, priceOnRequest?: boolean): string {
  if (priceOnRequest || !price) return 'Price on Request'
  return new Intl.NumberFormat('de-DE', {
    style:                'currency',
    currency:             'EUR',
    maximumFractionDigits: 0,
  }).format(price)
}

// ─── Spec stat ────────────────────────────────────────────────────────────────

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        className="font-serif"
        style={{ fontSize: 'clamp(1.625rem, 2.5vw, 2.25rem)', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: '6px' }}
      >
        {value}
      </div>
      <div
        className="type-eyebrow"
        style={{ color: 'var(--text-tertiary)', letterSpacing: '0.12em' }}
      >
        {label}
      </div>
    </div>
  )
}

// ─── Feature chip ─────────────────────────────────────────────────────────────

function FeatureChip({ label }: { label: string }) {
  return (
    <div
      className="feature-chip"
      style={{
        display:      'inline-flex',
        alignItems:   'center',
        gap:          '7px',
        fontFamily:   'var(--font-sans)',
        fontSize:     '13px',
        fontWeight:   400,
        letterSpacing: '0.02em',
        color:        'var(--text-secondary)',
        background:   'var(--surface-primary)',
        border:       '1px solid var(--border-muted)',
        borderRadius: 'var(--radius-sm)',
        padding:      '7px 13px',
        whiteSpace:   'nowrap',
      }}
    >
      <span
        style={{
          width:           '5px',
          height:          '5px',
          borderRadius:    '50%',
          backgroundColor: 'var(--cta-primary-bg)',
          flexShrink:      0,
        }}
      />
      {label}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PropertyDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  // Single query: fetches property detail + related properties in one request
  const property: PropertyDetail | null = await client.fetch(propertyDetailQuery, { slug }).catch(() => null)
  if (!property) notFound()

  const related: PropertyListItem[] = property.related ?? []
  const hasImages = (property.images?.length ?? 0) > 0

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.2ibiza.com'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type':    'RealEstateListing',
    name:       property.title,
    url:        `${siteUrl}/properties/${property.slug.current}`,
    ...(property.images?.[0] && {
      image: urlFor(property.images[0]).width(1200).height(630).fit('crop').url(),
    }),
    address: {
      '@type':          'PostalAddress',
      addressLocality:  property.area?.name ?? 'Ibiza',
      addressCountry:   'ES',
    },
    ...(property.beds  && { numberOfRooms: property.beds }),
    ...(property.sqm   && { floorSize: { '@type': 'QuantitativeValue', value: property.sqm, unitCode: 'MTK' } }),
    ...(!property.priceOnRequest && property.price && {
      offers: { '@type': 'Offer', price: property.price, priceCurrency: 'EUR' },
    }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── 1. Hero Gallery ─────────────────────────────────────────────── */}
      {hasImages ? (
        <PropertyHeroGallery
          images={property.images ?? []}
          title={property.title}
          exclusive={property.exclusive}
          status={property.status}
        />
      ) : (
        /* Fallback when no images uploaded yet */
        <div
          style={{
            height:          'clamp(320px, 50vh, 560px)',
            backgroundColor: 'var(--bg-deep)',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
          }}
        >
          <p className="type-caption" style={{ color: 'rgba(245,240,232,0.25)' }}>No images available</p>
        </div>
      )}

      {/* ── 2. Property Summary ─────────────────────────────────────────── */}
      <div style={{ backgroundColor: 'var(--surface-primary)', borderBottom: '1px solid var(--border-soft)' }}>
        <div
          className="mx-auto"
          style={{
            maxWidth:     'var(--content-lg)',
            paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
            paddingBlock:  'clamp(2rem, 4vw, 3rem)',
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-12">

            {/* Title + area + inline specs */}
            <div style={{ flex: 1 }}>
              {property.area && (
                <p
                  className="type-eyebrow"
                  style={{ color: 'var(--accent-stone)', letterSpacing: '0.16em', marginBottom: '10px' }}
                >
                  {property.area.name}
                  {property.neighborhood && (
                    <>
                      <span style={{ opacity: 0.4, margin: '0 8px' }}>·</span>
                      <span style={{ opacity: 0.72 }}>{property.neighborhood}</span>
                    </>
                  )}
                </p>
              )}
              <h1
                className="font-serif"
                style={{
                  color:         'var(--text-primary)',
                  fontWeight:    500,
                  letterSpacing: '-0.025em',
                  lineHeight:    1.05,
                  marginBottom:  '20px',
                  maxWidth:      '680px',
                }}
              >
                {property.title}
              </h1>

            </div>

            {/* Price + stats */}
            <div style={{ flexShrink: 0 }}>
              <div
                className="font-serif"
                style={{
                  fontSize:     'clamp(1.875rem, 3.5vw, 2.75rem)',
                  fontWeight:   500,
                  color:        'var(--text-primary)',
                  lineHeight:   1,
                  marginBottom: '10px',
                  letterSpacing: '-0.02em',
                }}
              >
                {formatPrice(property.price, property.priceOnRequest)}
              </div>
              {property.hasTouristLicense && (
                <span
                  className="type-caption"
                  style={{
                    backgroundColor: 'var(--bg-canvas)',
                    color:           'var(--text-secondary)',
                    border:          '1px solid var(--border-soft)',
                    padding:         '4px 10px',
                    letterSpacing:   '0.10em',
                    textTransform:   'uppercase',
                    display:         'inline-block',
                  }}
                >
                  Tourist License
                </span>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Stat bar ────────────────────────────────────────────────────── */}
      {(property.beds || property.baths || property.sqm || property.plotSqm) && (
        <div style={{ backgroundColor: 'var(--bg-section-muted)', borderBottom: '1px solid var(--border-soft)' }}>
          <div
            className="mx-auto"
            style={{
              maxWidth:     'var(--content-lg)',
              paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
              paddingBlock:  'clamp(1.5rem, 3vw, 2rem)',
            }}
          >
            <div className="flex flex-wrap gap-x-10 gap-y-5">
              {property.beds      && <Stat value={String(property.beds)}                      label="Bedrooms"   />}
              {property.baths     && <Stat value={String(property.baths)}                     label="Bathrooms"  />}
              {property.sqm       && <Stat value={`${property.sqm.toLocaleString()} m²`}      label="Built area" />}
              {property.plotSqm   && <Stat value={`${property.plotSqm.toLocaleString()} m²`}  label="Plot size"  />}
              {property.propertyType && (
                <Stat
                  value={property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
                  label="Type"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 3 + 4. Main content + sticky sidebar ────────────────────────── */}
      <div style={{ backgroundColor: 'var(--bg-canvas-soft)' }}>
        <div
          className="mx-auto"
          style={{
            maxWidth:     'var(--content-lg)',
            paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
            paddingBlock:  'clamp(3rem, 5vw, 5rem)',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16">

            {/* ── Content column ─────────────────────────────────────────── */}
            <div className="lg:col-span-2 flex flex-col" style={{ gap: 'clamp(48px, 6vw, 72px)' }}>

              {/* 3. Key Features */}
              {(property.features?.length ?? 0) > 0 && (
                <div>
                  <div className="eyebrow-row mb-6">
                    <span className="type-eyebrow" style={{ color: 'var(--text-tertiary)' }}>Features</span>
                  </div>
                  <div className="flex flex-wrap" style={{ gap: '8px' }}>
                    {property.features?.map((f: string) => (
                      <FeatureChip key={f} label={f} />
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Description */}
              {property.description && (
                <div>
                  <div className="eyebrow-row mb-6">
                    <span className="type-eyebrow" style={{ color: 'var(--text-tertiary)' }}>About this Property</span>
                  </div>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <PortableText value={property.description as any[]} components={propertyPtComponents} />
                </div>
              )}

              {/* Location section */}
              {property.area && (
                <div
                  style={{
                    borderTop:  '1px solid var(--border-soft)',
                    paddingTop: 'clamp(40px, 5vw, 56px)',
                  }}
                >
                  <div className="eyebrow-row mb-6">
                    <span className="type-eyebrow" style={{ color: 'var(--text-tertiary)' }}>Location</span>
                  </div>
                  <h3
                    className="font-serif"
                    style={{
                      color:        'var(--text-primary)',
                      fontWeight:   500,
                      marginBottom: '6px',
                    }}
                  >
                    {property.area.name}
                  </h3>
                  {property.neighborhood && (
                    <p
                      className="type-eyebrow"
                      style={{ color: 'var(--text-tertiary)', letterSpacing: '0.12em', marginBottom: '12px' }}
                    >
                      {property.neighborhood}
                    </p>
                  )}
                  <Link
                    href={`/areas/${property.area.slug?.current}`}
                    className="section-more-link"
                  >
                    Explore {property.area.name}
                    <span className="block h-px bg-current" style={{ width: '24px' }} />
                  </Link>
                </div>
              )}

            </div>

            {/* ── Sidebar ────────────────────────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="sticky" style={{ top: '112px' }}>

                {/* Price card */}
                <div
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    border:          '1px solid var(--border-soft)',
                    borderRadius:    'var(--radius-md)',
                    overflow:        'hidden',
                    boxShadow:       'var(--shadow-soft)',
                  }}
                >
                  {/* Price header */}
                  <div
                    style={{
                      padding:       'clamp(20px, 3vw, 28px) clamp(20px, 3vw, 28px) clamp(16px, 2vw, 20px)',
                      borderBottom:  '1px solid var(--border-soft)',
                    }}
                  >
                    <div
                      className="font-serif"
                      style={{
                        fontSize:     'clamp(1.5rem, 2.5vw, 2rem)',
                        fontWeight:   500,
                        color:        'var(--cta-primary-bg)',
                        lineHeight:   1,
                        letterSpacing: '-0.02em',
                        marginBottom: property.hasTouristLicense ? '10px' : 0,
                      }}
                    >
                      {formatPrice(property.price, property.priceOnRequest)}
                    </div>
                    {property.hasTouristLicense && (
                      <span
                        className="type-caption"
                        style={{
                          backgroundColor: 'var(--bg-canvas)',
                          color:           'var(--text-secondary)',
                          border:          '1px solid var(--border-soft)',
                          padding:         '3px 8px',
                          letterSpacing:   '0.10em',
                          textTransform:   'uppercase',
                          display:         'inline-block',
                        }}
                      >
                        Tourist License
                      </span>
                    )}
                  </div>

                  {/* Form */}
                  <div style={{ padding: 'clamp(20px, 3vw, 28px)' }}>
                    <EnquiryForm propertyTitle={property.title} />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── 5. Secondary Image Gallery ──────────────────────────────────── */}
      {hasImages && (property.images?.length ?? 0) > 1 && (
        <div style={{ backgroundColor: 'var(--bg-canvas)' }}>
          <div
            className="mx-auto"
            style={{
              maxWidth:     'var(--content-lg)',
              paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
              paddingBlock:  'clamp(3rem, 5vw, 5rem)',
            }}
          >
            <div className="flex items-end justify-between" style={{ marginBottom: 'clamp(28px, 4vw, 40px)' }}>
              <div>
                <div className="eyebrow-row mb-3">
                  <span className="type-eyebrow" style={{ color: 'var(--text-tertiary)' }}>Gallery</span>
                </div>
                <h2
                  className="font-serif"
                  style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: 0 }}
                >
                  All Photos
                </h2>
              </div>
              <span className="type-caption" style={{ color: 'var(--text-tertiary)' }}>
                {property.images?.length} images
              </span>
            </div>
            <PropertyGallery images={property.images ?? []} title={property.title} />
          </div>
        </div>
      )}

      {/* ── 7. Similar Properties ───────────────────────────────────────── */}
      {related.length > 0 && (
        <section style={{ backgroundColor: 'var(--bg-canvas-soft)' }}>
          <div
            className="mx-auto"
            style={{
              maxWidth:     'var(--content-lg)',
              paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
              paddingBlock:  'clamp(3rem, 5vw, 5rem)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4" style={{ marginBottom: 'clamp(28px, 4vw, 40px)' }}>
              <div>
                <div className="eyebrow-row mb-3">
                  <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>More Properties</span>
                </div>
                <h2
                  className="font-serif"
                  style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: 0 }}
                >
                  {property.area?.name ? `More in ${property.area.name}` : 'Similar Properties'}
                </h2>
              </div>
              <Link href="/properties" className="section-more-link shrink-0">
                View all listings
                <span className="block h-px bg-current" style={{ width: '24px' }} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {related.map(p => (
                <PropertyCard key={p._id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 8. Contact CTA ──────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: 'var(--bg-deep)',
          paddingBlock:    'clamp(3.5rem, 6vw, 5.5rem)',
          borderTop:       '1px solid var(--border-dark)',
        }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth:     'var(--content-lg)',
            paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-20">

            {/* Editorial copy */}
            <div style={{ maxWidth: '520px' }}>
              <div className="eyebrow-row mb-5">
                <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>
                  Interested in this Property?
                </span>
              </div>
              <h2
                className="font-serif"
                style={{
                  color:        'var(--text-on-dark)',
                  fontWeight:   500,
                  lineHeight:   1.05,
                  marginBottom: '18px',
                }}
              >
                Let us arrange<br />a private viewing.
              </h2>
              <p
                className="type-body-sm"
                style={{
                  color:        'rgba(245,240,232,0.72)',
                  lineHeight:   1.8,
                  marginBottom: 0,
                }}
              >
                Our team will answer your questions and organise a discreet
                visit at your convenience. All enquiries are handled with
                complete confidentiality.
              </p>
            </div>

            {/* Contact actions */}
            <div
              className="flex flex-col sm:flex-row lg:flex-col gap-3"
              style={{ flexShrink: 0 }}
            >
              <a
                href="tel:+34971000000"
                style={{
                  display:         'inline-flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  gap:             '10px',
                  fontFamily:      'var(--font-sans)',
                  fontSize:        '13px',
                  fontWeight:      500,
                  letterSpacing:   '0.10em',
                  textTransform:   'uppercase',
                  textDecoration:  'none',
                  color:           'var(--cta-primary-text)',
                  backgroundColor: 'var(--cta-primary-bg)',
                  padding:         '0 28px',
                  height:          '52px',
                  whiteSpace:      'nowrap',
                  transition:      'opacity var(--transition-ui)',
                }}
                className="hover-opacity-72"
              >
                <span>↗</span>
                +34 971 000 000
              </a>
              <a
                href="mailto:hello@2ibiza.com"
                style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  gap:            '10px',
                  fontFamily:     'var(--font-sans)',
                  fontSize:       '13px',
                  fontWeight:     500,
                  letterSpacing:  '0.10em',
                  textTransform:  'uppercase',
                  textDecoration: 'none',
                  color:          'var(--text-on-dark)',
                  border:         '1px solid var(--border-dark)',
                  padding:        '0 28px',
                  height:         '52px',
                  whiteSpace:     'nowrap',
                  transition:     'border-color var(--transition-ui)',
                }}
                className="hover-on-dark"
              >
                <span style={{ opacity: 0.5 }}>↗</span>
                hello@2ibiza.com
              </a>
              <p
                className="type-caption"
                style={{
                  color:        'rgba(245,240,232,0.35)',
                  textAlign:    'center',
                  marginBottom: 0,
                  marginTop:    '2px',
                }}
              >
                Or use the enquiry form above ↑
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
