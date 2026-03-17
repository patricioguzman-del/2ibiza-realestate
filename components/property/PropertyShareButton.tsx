'use client'

import { useState, useCallback } from 'react'

export default function PropertyShareButton() {
  const [copied, setCopied] = useState(false)

  const handleShare = useCallback(async () => {
    const url = window.location.href
    if (typeof navigator.share === 'function') {
      try { await navigator.share({ url }) } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2200)
      } catch {}
    }
  }, [])

  return (
    <button
      onClick={handleShare}
      aria-label={copied ? 'Link copied' : 'Share this property'}
      style={{
        display:       'inline-flex',
        alignItems:    'center',
        gap:           '7px',
        fontFamily:    'var(--font-sans)',
        fontSize:      '11px',
        fontWeight:    500,
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
        color:         copied ? 'var(--cta-primary-bg)' : 'var(--text-secondary)',
        background:    'none',
        border:        `1px solid ${copied ? 'rgba(200,110,74,0.35)' : 'var(--border-muted)'}`,
        padding:       '9px 15px',
        cursor:        'pointer',
        transition:    'color 220ms ease, border-color 220ms ease',
        whiteSpace:    'nowrap',
        flexShrink:    0,
      }}
    >
      {copied ? (
        <>
          {/* Checkmark */}
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none" aria-hidden="true">
            <path d="M1 4.5L4 7.5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Copied
        </>
      ) : (
        <>
          {/* Share / network icon */}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="9.5" cy="2" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="9.5" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="2.5" cy="6"  r="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <line x1="3.8" y1="5.2" x2="8.2" y2="2.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="3.8" y1="6.8" x2="8.2" y2="9.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          Share
        </>
      )}
    </button>
  )
}
