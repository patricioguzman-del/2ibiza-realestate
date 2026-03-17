import Link from 'next/link'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { client } from '../../../../sanity/lib/client'
import { propertyDetailQuery, allPropertiesQuery } from '../../../../sanity/lib/queries'
import { urlFor } from '../../../../sanity/lib/image'
import { PortableText } from '@portabletext/react'
import PropertyCard from '../../../../components/property/PropertyCard'
import EnquiryForm from '../../../../components/property/EnquiryForm'
import PropertyShareButton from '../../../../components/property/PropertyShareButton'
import { propertyPtComponents } from '../../../../components/portable-text/PropertyPortableText'
import { CONTACT } from '../../../../lib/constants'
import type { Metadata } from 'next'
import type { PropertyDetail, PropertyListItem } from '../../../../types'

// Code-split the gallery components — large, only needed after images load
const PropertyHeroGallery = dynamic(
  () => import('../../../../components/property/PropertyHeroGallery'),
  {
    loading: () => (
      <div style={{ height: 'clamp(480px, 78vh, 920px)', backgroundColor: 'var(--bg-deep)' }} />
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

// Fix #2: use en-GB locale for €2,500,000 format (was de-DE which gives 2.500.000 €)
function formatPrice(price?: number, priceOnRequest?: boolean): string {
  if (priceOnRequest || !price) return 'Price on Request'
  return new Intl.NumberFormat('en-GB', {
    style:                 'currency',
    currency:              'EUR',
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
      <div className="type-eyebrow" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.12em' }}>
        {label}
      </div>
    </div>
  )
}

// ─── Feature chip ─────────────────────────────────────────────────────────────

// Fix #7: changed background from --surface-primary (white) to --bg-canvas for better visibility
function FeatureChip({ label }: { label: string }) {
  return (
    <div
      style={{
        display:       'inline-flex',
        alignItems:    'center',
        gap:           '7px',
        fontFamily:    'var(--font-sans)',
        fontSize:      '13px',
        fontWeight:    400,
        letterSpacing: '0.02em',
        color:         'var(--text-secondary)',
        background:    'var(--bg-section-muted)',
        border:        '1px solid var(--border-soft)',
        padding:       '7px 13px',
        whiteSpace:    'nowrap',
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

// ─── Tourist license badge ────────────────────────────────────────────────────

// Fix #9: brass accent treatment so it reads as a genuine selling point
function TouristLicenseBadge() {
  return (
    <span
      className="type-caption"
      style={{
        display:         'inline-flex',
        alignItems:      'center',
        gap:             '6px',
        backgroundColor: 'rgba(200,110,74,0.10)',
        color:           'var(--cta-primary-bg)',
        border:          '1px solid rgba(200,110,74,0.30)',
        padding:         '5px 11px',
        letterSpacing:   '0.10em',
        textTransform:   'uppercase',
      }}
    >
      <span style={{ width: '5px', height: '5px', backgroundColor: 'var(--cta-primary-bg)', flexShrink: 0 }} />
      Tourist Licence
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PropertyDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
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
      '@type':         'PostalAddress',
      addressLocality: property.area?.name ?? 'Ibiza',
      addressCountry:  'ES',
    },
    ...(property.beds && { numberOfRooms: property.beds }),
    ...(property.sqm  && { floorSize: { '@type': 'QuantitativeValue', value: property.sqm, unitCode: 'MTK' } }),
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

      {/* ── 1. Hero Gallery ───────────────────────────────────────────────── */}
      {hasImages ? (
        <PropertyHeroGallery
          images={property.images ?? []}
          title={property.title}
          exclusive={property.exclusive}
          status={property.status}
        />
      ) : (
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

      {/* ── Fix #1: Breadcrumb ────────────────────────────────────────────── */}
      <div style={{ backgroundColor: 'var(--bg-canvas-soft)', borderBottom: '1px solid var(--border-soft)' }}>
        <div
          className="mx-auto"
          style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)', paddingBlock: '13px' }}
        >
          <nav aria-label="Breadcrumb">
            <ol style={{ display: 'flex', alignItems: 'center', gap: '0', listStyle: 'none', margin: 0, padding: 0 }}>
              <li>
                <Link
                  href="/properties"
                  className="type-caption"
                  style={{ color: 'var(--text-tertiary)', textDecoration: 'none', letterSpacing: '0.08em', transition: 'color 150ms ease' }}
                >
                  Properties
                </Link>
              </li>
              {property.area && (
                <>
                  <li aria-hidden style={{ color: 'var(--border-muted)', margin: '0 8px', fontSize: '11px' }}>/</li>
                  <li>
                    <Link
                      href={`/areas/${property.area.slug?.current}`}
                      className="type-caption"
                      style={{ color: 'var(--text-tertiary)', textDecoration: 'none', letterSpacing: '0.08em', transition: 'color 150ms ease' }}
                    >
                      {property.area.name}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden style={{ color: 'var(--border-muted)', margin: '0 8px', fontSize: '11px' }}>/</li>
              <li
                className="type-caption"
                style={{
                  color:        'var(--text-secondary)',
                  letterSpacing: '0.08em',
                  overflow:      'hidden',
                  textOverflow:  'ellipsis',
                  whiteSpace:    'nowrap',
                  maxWidth:      'clamp(160px, 30vw, 340px)',
                }}
                aria-current="page"
              >
                {property.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── 2. Property Summary ───────────────────────────────────────────── */}
      {/* Fix #3: price removed from here — it lives in sidebar only       */}
      <div style={{ backgroundColor: 'var(--surface-primary)', borderBottom: '1px solid var(--border-soft)' }}>
        <div
          className="mx-auto"
          style={{
            maxWidth:      'var(--content-lg)',
            paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
            paddingBlock:  'clamp(1.75rem, 3.5vw, 2.5rem)',
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-12">

            {/* Title + area */}
            <div style={{ flex: 1 }}>
              {(property.neighborhood || property.area) && (
                <p
                  className="type-eyebrow"
                  style={{ color: 'var(--accent-stone)', letterSpacing: '0.16em', marginBottom: '10px' }}
                >
                  {/* Neighbourhood is the primary reference; area is secondary context */}
                  {property.neighborhood ?? property.area?.name}
                  {property.neighborhood && property.area && (
                    <>
                      <span style={{ opacity: 0.3, margin: '0 8px' }}>·</span>
                      <span style={{ opacity: 0.48, letterSpacing: '0.10em' }}>{property.area.name}</span>
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
                  marginBottom:  property.hasTouristLicense ? '16px' : 0,
                  maxWidth:      '680px',
                }}
              >
                {property.title}
              </h1>
              {/* Fix #9: Tourist licence badge — brass accent, more prominent */}
              {property.hasTouristLicense && <TouristLicenseBadge />}
            </div>

            {/* Fix #12: Share button (right-aligned) */}
            <div style={{ flexShrink: 0, paddingTop: '4px' }}>
              <PropertyShareButton />
            </div>

          </div>
        </div>
      </div>

      {/* ── Stat bar ──────────────────────────────────────────────────────── */}
      {(property.beds || property.baths || property.sqm || property.plotSqm) && (
        <div style={{ backgroundColor: 'var(--bg-section-muted)', borderBottom: '1px solid var(--border-soft)' }}>
          <div
            className="mx-auto"
            style={{
              maxWidth:      'var(--content-lg)',
              paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
              paddingBlock:  'clamp(1.5rem, 3vw, 2rem)',
            }}
          >
            <div className="flex flex-wrap gap-x-10 gap-y-5">
              {property.beds      && <Stat value={String(property.beds)}                     label="Bedrooms"   />}
              {property.baths     && <Stat value={String(property.baths)}                    label="Bathrooms"  />}
              {property.sqm       && <Stat value={`${property.sqm.toLocaleString()} m²`}     label="Built area" />}
              {property.plotSqm   && <Stat value={`${property.plotSqm.toLocaleString()} m²`} label="Plot size"  />}
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

      {/* ── 3 + 4. Main content + sticky sidebar ─────────────────────────── */}
      <div style={{ backgroundColor: 'var(--bg-canvas-soft)' }}>
        <div
          className="mx-auto"
          style={{
            maxWidth:      'var(--content-lg)',
            paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
            paddingBlock:  'clamp(3rem, 5vw, 5rem)',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16">

            {/* ── Content column ──────────────────────────────────────────── */}
            <div className="lg:col-span-2 flex flex-col" style={{ gap: 'clamp(48px, 6vw, 72px)' }}>

              {/* Features */}
              {(property.features?.length ?? 0) > 0 && (
                <div>
                  <div className="eyebrow-row mb-6">
                    <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>Features</span>
                  </div>
                  <div className="flex flex-wrap" style={{ gap: '8px' }}>
                    {property.features?.map((f: string) => (
                      <FeatureChip key={f} label={f} />
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {property.description && (
                <div>
                  <div className="eyebrow-row mb-6">
                    <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>About this Property</span>
                  </div>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <PortableText value={property.description as any[]} components={propertyPtComponents} />
                </div>
              )}

              {/* Fix #11: Floor plan placeholder ─────────────────────────── */}
              <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: 'clamp(40px, 5vw, 56px)' }}>
                <div className="eyebrow-row mb-6">
                  <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>Floor Plan</span>
                </div>
                <div
                  style={{
                    border:          '1px solid var(--border-soft)',
                    backgroundColor: 'var(--bg-canvas)',
                    padding:         'clamp(32px, 5vw, 52px) clamp(24px, 4vw, 40px)',
                    display:         'flex',
                    flexDirection:   'column',
                    alignItems:      'center',
                    gap:             '20px',
                    textAlign:       'center',
                  }}
                >
                  {/* Floor plan icon */}
                  <svg
                    width="52"
                    height="52"
                    viewBox="0 0 52 52"
                    fill="none"
                    aria-hidden="true"
                    style={{ opacity: 0.22, color: 'var(--text-primary)' }}
                  >
                    <rect x="5" y="5" width="42" height="42" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="5"  y1="26" x2="47" y2="26" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="26" y1="26" x2="26" y2="47" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="5"  y1="16" x2="18" y2="16" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="18" y1="5"  x2="18" y2="26" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="32" y1="5"  x2="32" y2="26" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <div>
                    <p
                      className="type-body-sm"
                      style={{ color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.7 }}
                    >
                      Floor plan available upon request.
                    </p>
                    <a
                      href={`${CONTACT.emailHref}?subject=Floor Plan Request: ${encodeURIComponent(property.title)}`}
                      className="section-more-link"
                    >
                      Request Floor Plan
                      <span className="block h-px bg-current" style={{ width: '24px' }} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Fix #6: Location — now includes area.summary ─────────────── */}
              {property.area && (
                <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: 'clamp(40px, 5vw, 56px)' }}>
                  <div className="eyebrow-row mb-6">
                    <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>Location</span>
                  </div>
                  {/* Neighbourhood is the h3 — the primary location identity */}
                  <h3
                    className="font-serif"
                    style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: '6px' }}
                  >
                    {property.neighborhood ?? property.area.name}
                  </h3>
                  {/* Area name as secondary context below the heading */}
                  {property.neighborhood && (
                    <p
                      className="type-eyebrow"
                      style={{ color: 'var(--text-tertiary)', letterSpacing: '0.12em', marginBottom: '12px' }}
                    >
                      {property.area.name}
                    </p>
                  )}
                  {property.area.summary && (
                    <p
                      className="type-body-sm"
                      style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px', maxWidth: '56ch' }}
                    >
                      {property.area.summary}
                    </p>
                  )}
                  <Link href={`/areas/${property.area.slug?.current}`} className="section-more-link">
                    Explore {property.area.name}
                    <span className="block h-px bg-current" style={{ width: '24px' }} />
                  </Link>
                </div>
              )}

            </div>

            {/* ── Sidebar ─────────────────────────────────────────────────── */}
            <div className="lg:col-span-1">
              {/* Fix #4: id added so mobile sticky bar can anchor to it */}
              <div id="enquiry-form" className="sticky" style={{ top: '112px' }}>

                {/* Price + enquiry card */}
                <div
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    border:          '1px solid var(--border-soft)',
                    overflow:        'hidden',
                    boxShadow:       'var(--shadow-soft)',
                  }}
                >
                  {/* Price header */}
                  <div
                    style={{
                      padding:      'clamp(20px, 3vw, 28px) clamp(20px, 3vw, 28px) clamp(16px, 2vw, 20px)',
                      borderBottom: '1px solid var(--border-soft)',
                    }}
                  >
                    <div
                      className="font-serif"
                      style={{
                        fontSize:      'clamp(1.5rem, 2.5vw, 2rem)',
                        fontWeight:    500,
                        color:         'var(--cta-primary-bg)',
                        lineHeight:    1,
                        letterSpacing: '-0.02em',
                        marginBottom:  property.hasTouristLicense ? '12px' : 0,
                      }}
                    >
                      {formatPrice(property.price, property.priceOnRequest)}
                    </div>
                    {property.hasTouristLicense && <TouristLicenseBadge />}
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

      {/* ── Fix #10: Secondary Image Gallery ─────────────────────────────── */}
      {hasImages && (property.images?.length ?? 0) > 1 && (
        <div style={{ backgroundColor: 'var(--bg-canvas)' }}>
          <div
            className="mx-auto"
            style={{
              maxWidth:      'var(--content-lg)',
              paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
              paddingBlock:  'clamp(3rem, 5vw, 5rem)',
            }}
          >
            <div className="flex items-end justify-between" style={{ marginBottom: 'clamp(28px, 4vw, 40px)' }}>
              <div>
                <div className="eyebrow-row mb-3">
                  <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>Gallery</span>
                </div>
                <h2
                  className="font-serif"
                  style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: 0 }}
                >
                  Photography
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

      {/* ── Similar Properties ────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section style={{ backgroundColor: 'var(--bg-canvas-soft)' }}>
          <div
            className="mx-auto"
            style={{
              maxWidth:      'var(--content-lg)',
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

      {/* ── Fix #13: Contact CTA — improved ──────────────────────────────── */}
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
            maxWidth:      'var(--content-lg)',
            paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-20">

            {/* Editorial copy */}
            <div style={{ maxWidth: '520px' }}>
              <div className="eyebrow-row mb-5">
                <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>
                  Private Viewings
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
                Arrange a viewing<br />at your convenience.
              </h2>
              <p
                className="type-body-sm"
                style={{ color: 'rgba(245,240,232,0.65)', lineHeight: 1.8, marginBottom: 0 }}
              >
                Our advisors will answer every question and organise a discreet
                visit around your schedule. All enquiries are handled with
                complete confidentiality.
              </p>
            </div>

            {/* Contact actions */}
            <div
              className="flex flex-col sm:flex-row lg:flex-col gap-3"
              style={{ flexShrink: 0 }}
            >
              <a href={CONTACT.phoneHref} className="btn-primary">
                <span aria-hidden>↗</span>
                {CONTACT.phone}
              </a>
              <a href={CONTACT.emailHref} className="btn-ghost-dark">
                <span style={{ opacity: 0.5 }} aria-hidden>↗</span>
                {CONTACT.email}
              </a>
              {/* Fix #14: replaced faint "form above" note with WhatsApp CTA */}
              <a
                href={CONTACT.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  gap:            '8px',
                  fontFamily:     'var(--font-sans)',
                  fontSize:       '12px',
                  fontWeight:     400,
                  letterSpacing:  '0.06em',
                  textTransform:  'uppercase',
                  textDecoration: 'none',
                  color:          'rgba(245,240,232,0.45)',
                  transition:     'color 200ms ease',
                  marginTop:      '2px',
                  justifySelf:    'center',
                }}
                className="hover-on-dark"
              >
                {/* WhatsApp icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ opacity: 0.6 }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp us directly
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ── Fix #4: Mobile sticky enquiry bar — hidden on lg+ ─────────────── */}
      <div
        className="lg:hidden"
        style={{
          position:        'fixed',
          bottom:          0,
          left:            0,
          right:           0,
          zIndex:          50,
          backgroundColor: 'var(--bg-deep)',
          borderTop:       '1px solid rgba(245,240,232,0.12)',
          padding:         '12px clamp(1.25rem, 5vw, 2rem)',
          paddingBottom:   'max(12px, env(safe-area-inset-bottom))',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'space-between',
          gap:             '16px',
          backdropFilter:  'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div>
          <p className="type-caption" style={{ color: 'rgba(245,240,232,0.40)', marginBottom: '2px', letterSpacing: '0.10em' }}>
            Asking Price
          </p>
          <div
            className="font-serif"
            style={{
              fontSize:      'clamp(1.125rem, 3vw, 1.375rem)',
              fontWeight:    500,
              color:         'var(--text-on-dark)',
              lineHeight:    1,
              letterSpacing: '-0.02em',
            }}
          >
            {formatPrice(property.price, property.priceOnRequest)}
          </div>
        </div>
        <a
          href="#enquiry-form"
          className="btn-primary"
          style={{ whiteSpace: 'nowrap', flexShrink: 0, textDecoration: 'none' }}
        >
          Enquire Now
        </a>
      </div>
    </>
  )
}
