import type { PortableTextComponents } from '@portabletext/react'

/**
 * PortableText block renderers for property description fields.
 * Extracted from properties/[slug]/page.tsx to keep the page component lean
 * and allow reuse across property-related contexts.
 */
export const propertyPtComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p
        style={{
          color:        'var(--text-secondary)',
          lineHeight:   1.85,
          marginBottom: '1.25rem',
          fontFamily:   'var(--font-sans)',
          fontSize:     '1rem',
        }}
      >
        {children}
      </p>
    ),

    h2: ({ children }) => (
      <h2
        className="font-serif"
        style={{
          color:        'var(--text-primary)',
          fontWeight:   500,
          marginBottom: '16px',
          marginTop:    '32px',
        }}
      >
        {children}
      </h2>
    ),

    h3: ({ children }) => (
      <h3
        className="font-serif"
        style={{
          color:        'var(--text-primary)',
          fontSize:     '1.5rem',
          fontWeight:   500,
          marginBottom: '12px',
          marginTop:    '24px',
        }}
      >
        {children}
      </h3>
    ),

    blockquote: ({ children }) => (
      <blockquote
        style={{
          borderLeft:  '2px solid var(--cta-primary-bg)',
          paddingLeft: '20px',
          marginBlock: '24px',
          color:       'var(--text-secondary)',
          fontStyle:   'italic',
        }}
      >
        {children}
      </blockquote>
    ),
  },
}
