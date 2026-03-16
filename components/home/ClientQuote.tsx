// ─── ClientQuote — anonymous social proof ────────────────────────────────────
//
// A single, well-attributed testimonial. Keeps details deliberately vague
// (no full names, no photographs) — consistent with the agency's discreet
// positioning and protects client privacy while establishing credibility.
// ─────────────────────────────────────────────────────────────────────────────

const QUOTE = {
  text:        'They showed us a property we would never have found on our own. Within a week we had fallen in love with it. The whole process — legal, negotiation, handover — was handled with complete discretion.',
  attribution: 'Entrepreneur & family buyer',
  origin:      'London',
}

export default function ClientQuote() {
  return (
    <section
      style={{
        backgroundColor: 'var(--bg-section-muted)',
        borderTop:       '1px solid var(--border-muted)',
        borderBottom:    '1px solid var(--border-muted)',
        paddingBlock:    'clamp(3rem, 5.5vw, 5rem)',
      }}
    >
      <div
        className="mx-auto text-center"
        style={{
          maxWidth:      '680px',
          paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
        }}
      >

        {/* Opening mark — decorative, not part of the readable text */}
        <div
          className="font-serif"
          aria-hidden="true"
          style={{
            fontSize:     'clamp(4rem, 8vw, 6rem)',
            lineHeight:   0.6,
            color:        'var(--accent-stone)',
            marginBottom: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            userSelect:   'none',
          }}
        >
          &ldquo;
        </div>

        {/* Quote body */}
        <blockquote
          style={{
            margin:        0,
            padding:       0,
            border:        'none',
          }}
        >
          <p
            className="font-serif"
            style={{
              fontSize:      'clamp(1.125rem, 2vw, 1.5rem)',
              fontWeight:    400,
              fontStyle:     'italic',
              lineHeight:    1.7,
              letterSpacing: '-0.01em',
              color:         'var(--text-primary)',
              marginBottom:  'clamp(1.5rem, 2.5vw, 2rem)',
            }}
          >
            {QUOTE.text}
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
                color:         'var(--accent-stone)',
              }}
            >
              {QUOTE.attribution}
              <span style={{ color: 'var(--text-tertiary)', margin: '0 8px' }}>·</span>
              {QUOTE.origin}
            </cite>
          </footer>
        </blockquote>

      </div>
    </section>
  )
}
