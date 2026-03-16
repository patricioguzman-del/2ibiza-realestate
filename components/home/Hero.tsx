'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// ─── Data ───────────────────────────────────────────────────────────────────

const HEADLINE_WORDS = [
  'Trusted', 'advice', 'for', 'buying',
  'and', 'selling', 'property', 'in', 'Ibiza',
]

const TRUST_ITEMS = [
  'Local market knowledge',
  'Private viewings',
  'Buyer & seller guidance',
  'English, Spanish & French-speaking service',
]

// ─── Animation helpers ───────────────────────────────────────────────────────

const FADE_UP = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
})

// ─── Component ───────────────────────────────────────────────────────────────

export default function Hero() {
  const [scrollY, setScrollY] = useState(0)

  // Parallax scroll tracking — RAF-throttled to avoid layout thrash
  useEffect(() => {
    let rafId: number
    const handle = () => {
      rafId = requestAnimationFrame(() => setScrollY(window.scrollY))
    }
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    return () => {
      window.removeEventListener('scroll', handle)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section
      className="relative flex flex-col overflow-hidden"
      style={{ minHeight: '88vh', backgroundColor: 'var(--bg-deep)' }}
    >

      {/* ── A. Background image — parallax ───────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&q=90&fit=crop"
          alt=""
          style={{
            position:       'absolute',
            top:            '-8%',
            left:           0,
            width:          '100%',
            height:         'calc(100% + 16%)',
            objectFit:      'cover',
            objectPosition: 'center 42%',
            transform:      `translateY(${scrollY * 0.08}px)`,
            willChange:     'transform',
          }}
          fetchPriority="high"
        />

        {/* Base wash */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(15,34,40,0.12)' }}
        />

        {/* Left directional — strengthened for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(15,34,40,0.82) 0%, rgba(15,34,40,0.60) 28%, rgba(15,34,40,0.22) 52%, transparent 72%)',
          }}
        />

        {/* Text-column scrim — targeted boost behind copy block */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(15,34,40,0.30) 0%, rgba(15,34,40,0.08) 42%, transparent 58%)',
          }}
        />

        {/* Bottom vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(15,34,40,0.40) 0%, rgba(15,34,40,0.08) 28%, transparent 52%)',
          }}
        />
      </div>

      {/* ── B. Content column ────────────────────────────────────────────── */}
      <div
        className="relative z-10 flex-1 flex flex-col justify-center"
        style={{
          paddingTop:    '104px',
          paddingBottom: 'clamp(2.5rem, 4.5vh, 3.5rem)',
        }}
      >
        <div
          className="mx-auto w-full"
          style={{
            maxWidth:      'var(--content-lg)',
            paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
          }}
        >

          {/* ── Eyebrow ─────────────────────────────────────────────────── */}
          <motion.p
            {...FADE_UP(0.08)}
            className="type-eyebrow"
            style={{ color: 'var(--accent-sand)', marginBottom: '20px' }}
          >
            Ibiza Real Estate
          </motion.p>

          {/* ── H1 — word-by-word masked reveal ─────────────────────────── */}
          <motion.h1
            style={{
              color:         'var(--text-on-dark)',
              marginBottom:  '24px',
              fontSize:      'clamp(2.2rem, 4.2vw, 3.7rem)',
              lineHeight:    1.0,
              letterSpacing: '-0.03em',
              maxWidth:      '700px',
            }}
            initial="hidden"
            animate="visible"
            variants={{
              hidden:  {},
              visible: { transition: { staggerChildren: 0.05, delayChildren: 0.18 } },
            }}
          >
            {HEADLINE_WORDS.map((word) => (
              <span key={word} className="word-mask">
                <motion.span
                  style={{ display: 'inline-block' }}
                  variants={{
                    hidden:  { y: '110%' },
                    visible: {
                      y:          0,
                      transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as const },
                    },
                  }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* ── Supporting text ──────────────────────────────────────────── */}
          <motion.p
            {...FADE_UP(0.54)}
            className="type-body-lg"
            style={{
              color:        'rgba(245,240,232,0.93)',
              maxWidth:     '520px',
              lineHeight:   1.65,
              marginBottom: '36px',
            }}
          >
            We help international buyers and Ibiza homeowners navigate sales,
            acquisitions, and valuations with local knowledge and a hands-on approach.
          </motion.p>

          {/* ── CTAs ─────────────────────────────────────────────────────── */}
          <motion.div
            {...FADE_UP(0.66)}
            className="flex flex-wrap items-center"
            style={{ gap: '14px', marginBottom: '28px' }}
          >
            <Link href="/properties" className="btn-primary">
              Browse Properties
            </Link>
            <Link href="/sell" className="btn-ghost-dark">
              Request a Valuation
            </Link>
          </motion.div>

          {/* ── Trust strip ──────────────────────────────────────────────── */}
          <motion.div
            {...FADE_UP(0.78)}
            className="flex items-center flex-wrap"
          >
            {TRUST_ITEMS.map((item, i) => (
              <span key={item} className="flex items-center">
                <span
                  style={{
                    fontFamily:    'var(--font-sans)',
                    fontSize:      '12.5px',
                    fontWeight:    500,
                    letterSpacing: '0.05em',
                    color:         'rgba(245,240,232,0.90)',
                  }}
                >
                  {item}
                </span>
                {i < TRUST_ITEMS.length - 1 && (
                  <span
                    style={{
                      margin:     '0 10px',
                      color:      'rgba(245,240,232,0.50)',
                      fontSize:   '14px',
                      lineHeight: 1,
                    }}
                  >
                    ·
                  </span>
                )}
              </span>
            ))}
          </motion.div>

        </div>
      </div>

    </section>
  )
}
