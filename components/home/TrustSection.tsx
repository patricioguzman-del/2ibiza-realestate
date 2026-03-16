// ─── TrustSection ─────────────────────────────────────────────────────────────
// Credibility section placed directly below the hero.
// Reinforces the agency's positioning — personal, local, experienced —
// before the search module and featured listings.
// Server Component: no client state needed.

// ─── Data ────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    n:     '01',
    title: 'Local knowledge',
    body:  "We understand Ibiza's areas, buyer profiles, and market dynamics across the island.",
  },
  {
    n:     '02',
    title: 'Personal guidance',
    body:  'You deal directly with experienced advisors from first conversation to completion.',
  },
  {
    n:     '03',
    title: 'Buyers and sellers',
    body:  'We support both property searches and valuations with a tailored, hands-on approach.',
  },
  {
    n:     '04',
    title: 'Discreet process',
    body:  'We value clarity, privacy, and well-managed transactions at every stage.',
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function TrustSection() {
  return (
    <section
      style={{
        backgroundColor: 'var(--bg-canvas-soft)',
        paddingBlock:    'clamp(4rem, 7vw, 6.5rem)',
      }}
    >
      <div
        className="mx-auto w-full"
        style={{
          maxWidth:      'var(--content-lg)',
          paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
        }}
      >

        {/* ── Section header — split: title left, copy right ─────────────── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{
            gap:           'clamp(1.5rem, 4vw, 3.5rem)',
            marginBottom:  'clamp(3rem, 5vw, 4.5rem)',
            paddingBottom: 'clamp(2.5rem, 4.5vw, 4rem)',
            borderBottom:  '1px solid var(--border-muted)',
          }}
        >

          {/* Title */}
          <div>
            <p
              className="type-eyebrow"
              style={{ color: 'var(--cta-primary-bg)', marginBottom: '14px' }}
            >
              Our approach
            </p>
            <h2
              style={{
                fontFamily:    'var(--font-serif)',
                fontSize:      'clamp(1.9rem, 3.2vw, 2.8rem)',
                fontWeight:    500,
                lineHeight:    1.08,
                letterSpacing: '-0.025em',
                color:         'var(--text-primary)',
                maxWidth:      '18ch',
              }}
            >
              A more personal approach to Ibiza real estate
            </h2>
          </div>

          {/* Supporting copy */}
          <div className="flex items-end lg:items-center">
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize:   'clamp(15px, 1.4vw, 17px)',
                fontWeight: 400,
                lineHeight: 1.72,
                color:      'var(--text-secondary)',
                maxWidth:   '52ch',
              }}
            >
              We work closely with buyers and owners across Ibiza, combining
              local market knowledge, careful guidance, and a straightforward
              way of working.
            </p>
          </div>

        </div>

        {/* ── Pillars — 4-col grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 'clamp(2rem, 3.5vw, 2.5rem)' }}>
          {PILLARS.map(pillar => (
            <div key={pillar.n}>

              {/* Accent rule + number */}
              <div
                style={{
                  display:       'flex',
                  alignItems:    'center',
                  gap:           '12px',
                  marginBottom:  '20px',
                  paddingTop:    '18px',
                  borderTop:     '2px solid var(--cta-primary-bg)',
                }}
              >
                <span
                  style={{
                    fontFamily:    'var(--font-sans)',
                    fontSize:      '11px',
                    fontWeight:    600,
                    letterSpacing: '0.14em',
                    color:         'var(--cta-primary-bg)',
                    lineHeight:    1,
                  }}
                >
                  {pillar.n}
                </span>
              </div>

              {/* Pillar title */}
              <h3
                style={{
                  fontFamily:    'var(--font-serif)',
                  fontSize:      'clamp(1.2rem, 1.6vw, 1.5rem)',
                  fontWeight:    500,
                  lineHeight:    1.2,
                  letterSpacing: '-0.015em',
                  color:         'var(--text-primary)',
                  marginBottom:  '12px',
                }}
              >
                {pillar.title}
              </h3>

              {/* Pillar body */}
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize:   '14px',
                  fontWeight: 400,
                  lineHeight: 1.72,
                  color:      'var(--text-secondary)',
                  margin:     0,
                }}
              >
                {pillar.body}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
