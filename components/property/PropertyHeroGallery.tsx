'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { urlFor } from '../../sanity/lib/image'

// ─── Types ───────────────────────────────────────────────────────────────────

interface PropertyHeroGalleryProps {
  images:    any[]
  title:     string
  exclusive?: boolean
  status?:   string
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PropertyHeroGallery({
  images,
  title,
  exclusive,
  status,
}: PropertyHeroGalleryProps) {
  const [active,   setActive]   = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const total    = images.length
  const closeRef = useRef<HTMLButtonElement>(null)
  const wasOpen  = useRef(false)

  // Move focus to the close button when the lightbox first opens
  useEffect(() => {
    if (lightbox !== null && !wasOpen.current) closeRef.current?.focus()
    wasOpen.current = lightbox !== null
  }, [lightbox])

  // ── Navigation helpers ────────────────────────────────────────────────────

  const heroPrev = useCallback(
    () => setActive(i => (i === 0 ? total - 1 : i - 1)),
    [total],
  )
  const heroNext = useCallback(
    () => setActive(i => (i === total - 1 ? 0 : i + 1)),
    [total],
  )
  const lbPrev = useCallback(
    () => setLightbox(i => (i === null || i === 0 ? total - 1 : i - 1)),
    [total],
  )
  const lbNext = useCallback(
    () => setLightbox(i => (i === null || i === total - 1 ? 0 : i + 1)),
    [total],
  )

  // ── Keyboard: arrows + ESC for lightbox ───────────────────────────────────

  useEffect(() => {
    if (lightbox === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  lbPrev()
      if (e.key === 'ArrowRight') lbNext()
      if (e.key === 'Escape')     setLightbox(null)
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [lightbox, lbPrev, lbNext])

  if (!total) return null

  const heroUrl = urlFor(images[active]).width(1920).height(1080).fit('crop').url()
  const THUMB_LIMIT = 10

  return (
    <>
      {/* ── Hero image ────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', overflow: 'hidden', height: 'clamp(480px, 78vh, 920px)' }}>
        <Image
          src={heroUrl}
          alt={`${title} — photo ${active + 1}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Bottom gradient */}
        <div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to top, rgba(47,58,55,0.50) 0%, rgba(47,58,55,0.04) 45%, transparent 100%)',
          }}
        />

        {/* Badges — top left, below nav */}
        <div
          className="absolute flex gap-2"
          style={{ top: 'clamp(80px, 12vh, 108px)', left: 'clamp(1.5rem, 5vw, 4rem)' }}
        >
          {exclusive && (
            <span
              className="type-caption"
              style={{
                backgroundColor: 'var(--cta-primary-bg)',
                color:           'var(--cta-primary-text)',
                padding:         '5px 12px',
                letterSpacing:   '0.12em',
                textTransform:   'uppercase',
              }}
            >
              Exclusive
            </span>
          )}
          {status === 'under-offer' && (
            <span
              className="type-caption"
              style={{
                backgroundColor: 'var(--accent-sea)',
                color:           'var(--text-on-dark)',
                padding:         '5px 12px',
                letterSpacing:   '0.12em',
                textTransform:   'uppercase',
              }}
            >
              Under Offer
            </span>
          )}
        </div>

        {/* "View all photos" — bottom right */}
        <button
          onClick={() => setLightbox(active)}
          style={{
            position:        'absolute',
            bottom:          'clamp(20px, 3vw, 32px)',
            right:           'clamp(1.5rem, 5vw, 4rem)',
            backgroundColor: 'rgba(255,253,249,0.14)',
            backdropFilter:  'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border:          '1px solid rgba(255,253,249,0.22)',
            color:           'var(--text-on-dark)',
            fontFamily:      'var(--font-sans)',
            fontSize:        '11px',
            fontWeight:      500,
            letterSpacing:   '0.10em',
            textTransform:   'uppercase',
            padding:         '9px 18px',
            borderRadius:    '4px',
            cursor:          'pointer',
            transition:      'background-color 180ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,253,249,0.22)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,253,249,0.14)')}
        >
          View all {total} photos
        </button>

        {/* Hero prev / next arrows */}
        {total > 1 && (
          <>
            <HeroArrow direction="left"  onClick={heroPrev} label="Previous image" />
            <HeroArrow direction="right" onClick={heroNext} label="Next image"     />
          </>
        )}
      </div>

      {/* ── Thumbnail strip ───────────────────────────────────────────────── */}
      {total > 1 && (
        <div
          style={{
            backgroundColor: 'var(--bg-deep)',
            paddingBlock:    '10px',
            paddingInline:   'clamp(1.5rem, 5vw, 4rem)',
            display:         'flex',
            alignItems:      'center',
            gap:             '8px',
            overflowX:       'auto',
            scrollbarWidth:  'none',
          }}
        >
          {images.slice(0, THUMB_LIMIT).map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              aria-pressed={active === i}
              style={{
                flexShrink:   0,
                width:        '82px',
                height:       '56px',
                position:     'relative',
                overflow:     'hidden',
                borderRadius: '3px',
                border:       active === i
                  ? '2px solid var(--cta-primary-bg)'
                  : '2px solid transparent',
                padding:      0,
                cursor:       'pointer',
                opacity:      active === i ? 1 : 0.5,
                transition:   'opacity 180ms ease, border-color 180ms ease',
              }}
            >
              <Image
                src={urlFor(img).width(164).height(112).fit('crop').url()}
                alt=""
                fill
                className="object-cover"
                sizes="82px"
              />
            </button>
          ))}

          {total > THUMB_LIMIT && (
            <button
              onClick={() => setLightbox(THUMB_LIMIT)}
              aria-label={`View ${total - THUMB_LIMIT} more photos`}
              style={{
                flexShrink:      0,
                width:           '82px',
                height:          '56px',
                backgroundColor: 'rgba(245,240,232,0.07)',
                border:          '2px solid rgba(245,240,232,0.14)',
                borderRadius:    '3px',
                color:           'rgba(245,240,232,0.6)',
                fontFamily:      'var(--font-sans)',
                fontSize:        '11px',
                fontWeight:      500,
                letterSpacing:   '0.04em',
                cursor:          'pointer',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
              }}
            >
              +{total - THUMB_LIMIT}
            </button>
          )}
        </div>
      )}

      {/* ── Fullscreen lightbox ───────────────────────────────────────────── */}
      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Property photo gallery"
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
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'space-between',
              padding:         '16px clamp(1.5rem, 5vw, 2.5rem)',
              borderBottom:    '1px solid rgba(245,240,232,0.08)',
              flexShrink:      0,
            }}
          >
            <p
              className="type-caption"
              style={{ color: 'rgba(245,240,232,0.62)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 0 }}
            >
              {title}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span className="type-caption" style={{ color: 'rgba(245,240,232,0.62)', marginBottom: 0 }}>
                {lightbox + 1} / {total}
              </span>
              <button
                ref={closeRef}
                onClick={() => setLightbox(null)}
                aria-label="Close gallery"
                style={{
                  color:      'rgba(245,240,232,0.65)',
                  background: 'none',
                  border:     'none',
                  cursor:     'pointer',
                  fontSize:   '18px',
                  lineHeight: 1,
                  padding:    '4px',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-on-dark)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.65)')}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Main image */}
          <div
            style={{
              flex:           1,
              position:       'relative',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              padding:        '20px 72px',
              minHeight:      0,
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

            <LightboxArrow direction="left"  onClick={lbPrev} label="Previous photo" />
            <LightboxArrow direction="right" onClick={lbNext} label="Next photo"     />
          </div>

          {/* Thumbnail filmstrip */}
          <div
            style={{
              flexShrink:     0,
              display:        'flex',
              gap:            '5px',
              padding:        '10px clamp(1.5rem, 5vw, 2.5rem)',
              borderTop:      '1px solid rgba(245,240,232,0.08)',
              overflowX:      'auto',
              scrollbarWidth: 'none',
              justifyContent: total <= 16 ? 'center' : 'flex-start',
            }}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                aria-label={`View photo ${i + 1}`}
                style={{
                  flexShrink:   0,
                  width:        '54px',
                  height:       '36px',
                  position:     'relative',
                  overflow:     'hidden',
                  borderRadius: '2px',
                  border:       lightbox === i
                    ? '1px solid var(--cta-primary-bg)'
                    : '1px solid transparent',
                  padding:      0,
                  cursor:       'pointer',
                  opacity:      lightbox === i ? 1 : 0.4,
                  transition:   'opacity 150ms ease',
                }}
              >
                <Image
                  src={urlFor(img).width(108).height(72).fit('crop').url()}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="54px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroArrow({ direction, onClick, label }: { direction: 'left' | 'right'; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        position:        'absolute',
        [direction]:     '16px',
        top:             '50%',
        transform:       'translateY(-50%)',
        width:           '44px',
        height:          '44px',
        backgroundColor: 'rgba(255,253,249,0.12)',
        backdropFilter:  'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        border:          '1px solid rgba(255,253,249,0.18)',
        borderRadius:    '50%',
        color:           'rgba(245,240,232,0.8)',
        fontSize:        '22px',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        cursor:          'pointer',
        transition:      'background-color 180ms ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,253,249,0.22)')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,253,249,0.12)')}
    >
      {direction === 'left' ? '‹' : '›'}
    </button>
  )
}

function LightboxArrow({ direction, onClick, label }: { direction: 'left' | 'right'; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        position:        'absolute',
        [direction]:     '14px',
        top:             '50%',
        transform:       'translateY(-50%)',
        width:           '48px',
        height:          '48px',
        backgroundColor: 'rgba(245,240,232,0.07)',
        border:          '1px solid rgba(245,240,232,0.12)',
        borderRadius:    '50%',
        color:           'rgba(245,240,232,0.65)',
        fontSize:        '24px',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        cursor:          'pointer',
        transition:      'background-color 150ms ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(245,240,232,0.14)')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(245,240,232,0.07)')}
    >
      {direction === 'left' ? '‹' : '›'}
    </button>
  )
}
