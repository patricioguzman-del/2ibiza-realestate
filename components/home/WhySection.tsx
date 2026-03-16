import Link from 'next/link'

// ─── Data ──────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    title: 'Local Expertise',
    body: "Our team lives and works on the island. We understand Ibiza's neighborhoods, planning regulations, and lifestyle nuances in a way that only true local experience allows.",
  },
  {
    title: 'Discreet Network',
    body: "Many of Ibiza's most interesting opportunities never appear publicly. Through long-standing relationships with owners, developers and advisors, we provide access to properties beyond the open market.",
  },
  {
    title: 'End-to-End Guidance',
    body: 'From the first property visit to the final signature, we guide clients through every stage of the purchase or sale with clarity, transparency and attention to detail.',
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
          Two-column layout (Option A):
          Left  — section header, paragraph, soft CTA
          Right — three trust pillars in vertical stack with editorial dividers

          Collapses to single column on mobile/tablet.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 xl:gap-28">

          {/* ── A. Section Header (left) ──────────────────────────────── */}
          <div>
            <div className="eyebrow-row mb-[10px]">
              <span
                className="type-eyebrow"
                style={{ color: 'var(--accent-sand)' }}
              >
                The 2ibiza Approach
              </span>
            </div>

            <h2
              className="font-serif"
              style={{
                color:         'var(--text-on-dark)',
                fontWeight:    500,
                lineHeight:    1.1,     /* matches updated h2 global */
                marginBottom:  '28px',  /* was 24px — 4px more breathing room */
              }}
            >
              Local knowledge.<br />
              Global perspective.
            </h2>

            <p
              className="type-body"
              style={{
                color:        'rgba(245,240,232,0.76)',
                lineHeight:   1.78,
                maxWidth:     '44ch',
                marginBottom: '44px',
              }}
            >
              Working with 2Ibiza means benefiting from deep local insight,
              an international network of buyers, and a discreet, highly
              personal approach to every transaction.
            </p>

            {/* Soft CTA — understated, links to About */}
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
                    fontSize:      'clamp(1.375rem, 2vw, 1.75rem)',  /* raised max to 28px */
                    fontWeight:    500,
                    lineHeight:    1.2,
                    color:         'var(--text-on-dark)',
                    letterSpacing: '-0.015em',
                    marginBottom:  '14px',  /* was 12px */
                  }}
                >
                  {pillar.title}
                </h3>

                <p
                  className="type-body"
                  style={{
                    color:        'rgba(245,240,232,0.76)',
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
      </div>
    </section>
  )
}
