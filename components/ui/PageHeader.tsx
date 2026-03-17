import ContentContainer from './ContentContainer'

interface PageHeaderProps {
  /** Brass eyebrow label above the title */
  eyebrow:    string
  /** Main h1 */
  title:      string
  /** Optional supporting body copy */
  subtitle?:  string
  /** Optional background image URL — produces an atmospheric hero strip */
  imageUrl?:  string
}

/**
 * Standard dark page header used at the top of interior pages.
 * When imageUrl is provided, renders as a full atmospheric strip with
 * a background image + layered gradient overlay.
 */
export default function PageHeader({ eyebrow, title, subtitle, imageUrl }: PageHeaderProps) {
  if (imageUrl) {
    return (
      <div
        className="relative overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-deep)',
          paddingTop:      'clamp(7rem, 12vw, 10rem)',
          paddingBottom:   'clamp(3.5rem, 6vw, 5.5rem)',
          minHeight:       '340px',
        }}
      >
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          aria-hidden="true"
          style={{
            position:       'absolute',
            inset:          0,
            width:          '100%',
            height:         '100%',
            objectFit:      'cover',
            objectPosition: 'center 40%',
          }}
        />

        {/* Layered overlays — left-weighted for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(47,58,55,0.92) 0%, rgba(47,58,55,0.72) 35%, rgba(47,58,55,0.38) 65%, rgba(47,58,55,0.20) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(47,58,55,0.65) 0%, transparent 60%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
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
                  maxWidth:  '56ch',
                }}
              >
                {subtitle}
              </p>
            )}
          </ContentContainer>
        </div>
      </div>
    )
  }

  // Default — plain dark header (used by Blog, About, etc.)
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
