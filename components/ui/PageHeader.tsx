import ContentContainer from './ContentContainer'

interface PageHeaderProps {
  /** Brass eyebrow label above the title */
  eyebrow:   string
  /** Main h1 */
  title:     string
  /** Optional supporting body copy */
  subtitle?: string
}

/**
 * Standard dark page header used at the top of interior pages
 * (Properties, Areas, Blog, About, etc.).
 *
 * Handles top padding for the fixed navbar automatically.
 */
export default function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-deep)',
        paddingTop:      'clamp(6rem, 10vw, 8rem)',
        paddingBottom:   'clamp(3rem, 5vw, 4rem)',
      }}
    >
      <ContentContainer>
        <div className="eyebrow-row mb-[10px]">
          <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>
            {eyebrow}
          </span>
        </div>
        <h1 style={{ color: 'var(--text-on-dark)' }}>{title}</h1>
        {subtitle && (
          <p
            className="type-body"
            style={{
              color:     'rgba(245,240,232,0.76)',
              marginTop: '16px',
              maxWidth:  '60ch',
            }}
          >
            {subtitle}
          </p>
        )}
      </ContentContainer>
    </div>
  )
}
