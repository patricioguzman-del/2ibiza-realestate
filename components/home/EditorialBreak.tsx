// ─── Editorial break — pure typographic moment, no image ─────────────────────
// A single statement set large in Cormorant. Breaks the section-header formula
// and gives the page one moment that feels like a magazine spread, not a template.

export default function EditorialBreak() {
  return (
    <section
      style={{
        backgroundColor: 'var(--bg-section-muted)',
        paddingBlock:    'clamp(5rem, 9vw, 9rem)',
        borderTop:       '1px solid var(--border-soft)',
        borderBottom:    '1px solid var(--border-soft)',
        overflow:        'hidden',
      }}
    >
      <div
        style={{
          maxWidth:      'var(--content-lg)',
          paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
          margin:        '0 auto',
        }}
      >
        <p
          className="font-serif"
          style={{
            fontSize:      'clamp(2.75rem, 6.5vw, 6.25rem)',
            fontWeight:    300,
            fontStyle:     'italic',
            lineHeight:    1.04,
            letterSpacing: '-0.035em',
            color:         'var(--text-primary)',
            maxWidth:      '17ch',
            margin:        0,
          }}
        >
          The island{' '}
          <span style={{ fontWeight: 500, fontStyle: 'normal' }}>
            doesn&apos;t negotiate
          </span>
          {' '}on beauty.
        </p>

        <p
          style={{
            fontFamily:    'var(--font-sans)',
            fontSize:      '11px',
            fontWeight:    500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         'var(--accent-stone)',
            marginTop:     'clamp(2rem, 3.5vw, 3.5rem)',
            marginBottom:  0,
          }}
        >
          2ibiza · Est. 2015
        </p>
      </div>
    </section>
  )
}
