import Link from 'next/link'

// ─── Data ──────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    title: 'Local Expertise',
    body:  "Our team lives and works on the island. We understand Ibiza's neighborhoods, planning regulations, and lifestyle nuances in a way that only true local experience allows.",
  },
  {
    title: 'Discreet Network',
    body:  "Many of Ibiza's most interesting opportunities never appear publicly. Through long-standing relationships with owners, developers and advisors, we provide access to properties beyond the open market.",
  },
  {
    title: 'End-to-End Guidance',
    body:  'From the first property visit to the final signature, we guide clients through every stage of the purchase or sale with clarity, transparency and attention to detail.',
  },
]

// ─── Component ─────────────────────────────────────────────────────────────

export default function WhySection() {
  return (
    <section
      className="section-major-dark"
      style={{ backgroundColor: 'var(--bg-deep)' }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
      >

        {/*
          Two-column layout:
          Left  — section header, paragraph, soft CTA
          Right — three trust pillars in vertical stack

          Collapses to single column on mobile/tablet.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 xl:gap-28">

          {/* ── A. Section Header (left) ──────────────────────────────── */}
          <div>
            <div className="eyebrow-row mb-[10px]">
              <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>
                The 2ibiza Approach
              </span>
            </div>

            <h2
              className="font-serif"
              style={{
                color:         'var(--text-on-dark)',
                fontWeight:    500,
                lineHeight:    1.1,
                marginBottom:  '28px',
              }}
            >
              Local knowledge.<br />
              Global perspective.
            </h2>

            <p
              className="type-body"
              style={{
                color:        'var(--text-secondary)',
                lineHeight:   1.78,
                maxWidth:     '44ch',
                marginBottom: '44px',
              }}
            >
              Working with 2Ibiza means working with people who deal directly with you —
              experienced advisors who know the island, know the buyers, and know
              how to close transactions with care and discretion.
            </p>

            <Link href="/about" className="section-more-link-dark">
              Learn more about 2Ibiza
              <span className="block h-px bg-current" style={{ width: '24px' }} />
            </Link>
          </div>

          {/* ── B. Trust Pillars (right) ──────────────────────────────── */}
          <div>
            {PILLARS.map((pillar, i) => (
              <div
                key={pillar.title}
                style={{
                  paddingTop:    'clamp(28px, 3.5vw, 36px)',
                  paddingBottom: 'clamp(28px, 3.5vw, 36px)',
                  borderTop:     '1px solid var(--border-dark)',
                  ...(i === PILLARS.length - 1
                    ? { borderBottom: '1px solid var(--border-dark)' }
                    : {}),
                }}
              >
                <h3
                  className="font-serif"
                  style={{
                    fontSize:      'clamp(1.375rem, 2vw, 1.75rem)',
                    fontWeight:    500,
                    lineHeight:    1.2,
                    color:         'var(--text-on-dark)',
                    letterSpacing: '-0.015em',
                    marginBottom:  '14px',
                  }}
                >
                  {pillar.title}
                </h3>

                <p
                  className="type-body"
                  style={{
                    color:        'var(--text-secondary)',
                    lineHeight:   1.78,
                    maxWidth:     '420px',
                    marginBottom: 0,
                  }}
                >
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* ── C. Client testimonial — full-width, below both columns ────── */}
        <div
          style={{
            marginTop:  'clamp(44px, 6vw, 64px)',
            paddingTop: 'clamp(36px, 5vw, 52px)',
            borderTop:  '1px solid var(--border-dark)',
          }}
        >
          <div style={{ maxWidth: '72ch' }}>

            {/* Opening mark */}
            <div
              className="font-serif"
              aria-hidden="true"
              style={{
                fontSize:     'clamp(3rem, 5vw, 4rem)',
                lineHeight:   0.6,
                color:        'var(--accent-sand)',
                opacity:      0.60,
                userSelect:   'none',
                marginBottom: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              }}
            >
              &ldquo;
            </div>

            <blockquote style={{ margin: 0, padding: 0, border: 'none' }}>
              <p
                className="font-serif"
                style={{
                  fontSize:      'clamp(1.125rem, 1.8vw, 1.375rem)',
                  fontWeight:    400,
                  fontStyle:     'italic',
                  lineHeight:    1.72,
                  letterSpacing: '-0.01em',
                  color:         'var(--text-secondary)',
                  marginBottom:  '22px',
                }}
              >
                They showed us a property we would never have found on our own.
                Within a week we had fallen in love with it. The whole process —
                legal, negotiation, handover — was handled with complete discretion.
              </p>
              <footer>
                <cite
                  style={{
                    fontStyle:     'normal',
                    fontFamily:    'var(--font-sans)',
                    fontSize:      '11px',
                    fontWeight:    500,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color:         'var(--text-tertiary)',
                  }}
                >
                  Entrepreneur &amp; family buyer
                  <span style={{ margin: '0 8px', opacity: 0.5 }}>·</span>
                  London
                </cite>
              </footer>
            </blockquote>

          </div>
        </div>

      </div>
    </section>
  )
}
