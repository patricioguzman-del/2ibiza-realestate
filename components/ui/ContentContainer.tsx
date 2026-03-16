import type { CSSProperties, ReactNode } from 'react'

interface ContentContainerProps {
  children:  ReactNode
  /** 'lg' = --content-lg (default, site-wide max-width)
   *  'sm' = --content-sm (article / narrow reading column) */
  size?:     'sm' | 'lg'
  className?: string
  style?:    CSSProperties
  as?:       'div' | 'section' | 'article' | 'aside'
}

/**
 * Reusable constrained container.
 * Applies the project-standard max-width + fluid horizontal padding
 * so every section lines up on the same column grid.
 */
export default function ContentContainer({
  children,
  size      = 'lg',
  className = '',
  style,
  as:       Tag = 'div',
}: ContentContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full ${className}`}
      style={{
        maxWidth:      size === 'sm' ? 'var(--content-sm)' : 'var(--content-lg)',
        paddingInline: size === 'sm' ? 'clamp(1.5rem, 4vw, 4rem)' : 'clamp(1.5rem, 5vw, 4rem)',
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}
