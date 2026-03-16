'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { urlFor } from '../../sanity/lib/image'

const BLUR_DARK = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 4 3\'%3E%3Crect fill=\'%230F2228\' width=\'4\' height=\'3\'/%3E%3C/svg%3E'

// ─── Types ───────────────────────────────────────────────────────────────────

interface PropertyGalleryProps {
  images: any[]
  title:  string
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Secondary editorial grid gallery.
 * Shows all images in a responsive 2-column mosaic; clicking any opens a
 * fullscreen lightbox with arrow + keyboard navigation.
 */
export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const total    = images.length
  const closeRef = useRef<HTMLButtonElement>(null)
  const wasOpen  = useRef(false)

  // Move focus to the close button when the lightbox first opens
  useEffect(() => {
    if (lightbox !== null && !wasOpen.current) closeRef.current?.focus()
    wasOpen.current = lightbox !== null
  }, [lightbox])

  const prev = useCallback(
    () => setLightbox(i => (i === null || i === 0 ? total - 1 : i - 1)),
    [total],
  )
  const next = useCallback(
    () => setLightbox(i => (i === null || i === total - 1 ? 0 : i + 1)),
    [total],
  )

  useEffect(() => {
    if (lightbox === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     setLightbox(null)
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [lightbox, prev, next])

  if (total === 0) return null

  return (
    <>
      {/* ── Grid ──────────────────────────────────────────────────────────── */}
      <div className="prop-gallery-grid">
        {images.map((img, i) => {
          const isLarge = i === 0 || i === 5  // feature slots span 2 cols
          return (
            <button
              key={i}
              onClick={() => setLightbox(i)}
              aria-label={`Open photo ${i + 1} fullscreen`}
              className={`prop-gallery-cell${isLarge ? ' prop-gallery-cell--large' : ''} group`}
            >
              <Image
                src={urlFor(img).width(960).height(720).fit('crop').url()}
                alt={`${title} — photo ${i + 1}`}
                fill
                placeholder="blur"
                blurDataURL={BLUR_DARK}
                className="object-cover object-[center_38%] transition-transform duration-200 ease-out group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading={i < 4 ? 'eager' : 'lazy'}
              />
              {/* Hover overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ backgroundColor: 'rgba(47,58,55,0.10)' }}
              />
            </button>
          )
        })}
      </div>

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Property photos"
          style={{
            position:        'fixed',
            inset:           0,
            zIndex:          100,
            backgroundColor: 'rgba(47,58,55,0.97)',
            display:         'flex',
            flexDirection:   'column',
          }}
        >
          {/* Top bar */}
          <div
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              padding:        '16px clamp(1.5rem, 5vw, 2.5rem)',
              borderBottom:   '1px solid rgba(245,240,232,0.08)',
              flexShrink:     0,
            }}
          >
            <p
              className="type-caption"
              style={{ color: 'rgba(245,240,232,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 0 }}
            >
              {title}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span className="type-caption" style={{ color: 'rgba(245,240,232,0.4)', marginBottom: 0 }}>
                {lightbox + 1} / {total}
              </span>
              <button
                ref={closeRef}
                onClick={() => setLightbox(null)}
                aria-label="Close gallery"
                style={{
                  color: 'rgba(245,240,232,0.5)', background: 'none', border: 'none',
                  cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '4px',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-on-dark)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.5)')}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Image */}
          <div
            style={{
              flex: 1, position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px 72px', minHeight: 0,
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src={urlFor(images[lightbox]).width(1600).height(1000).fit('max').url()}
                alt={`${title} — photo ${lightbox + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            <LbArrow direction="left"  onClick={prev} label="Previous photo" />
            <LbArrow direction="right" onClick={next} label="Next photo"     />
          </div>
        </div>
      )}
    </>
  )
}

// ─── Sub-component ────────────────────────────────────────────────────────────

function LbArrow({ direction, onClick, label }: { direction: 'left' | 'right'; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        position: 'absolute', [direction]: '14px', top: '50%', transform: 'translateY(-50%)',
        width: '48px', height: '48px',
        backgroundColor: 'rgba(245,240,232,0.07)',
        border: '1px solid rgba(245,240,232,0.12)',
        borderRadius: '50%', color: 'rgba(245,240,232,0.65)',
        fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'background-color 150ms ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(245,240,232,0.14)')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(245,240,232,0.07)')}
    >
      {direction === 'left' ? '‹' : '›'}
    </button>
  )
}
