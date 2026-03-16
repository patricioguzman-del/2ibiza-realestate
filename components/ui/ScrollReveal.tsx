'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number        // stagger delay in ms
  threshold?: number    // 0–1, how much of the element must be visible
  className?: string
}

/**
 * Wraps children with a subtle fade-up entrance when scrolled into view.
 * Fires once only (observer disconnects after trigger).
 * Respects prefers-reduced-motion.
 */
export default function ScrollReveal({
  children,
  delay = 0,
  threshold = 0.08,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Honour reduced-motion: reveal immediately without animation
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity   = '1'
      el.style.transform = 'none'
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity   = '1'
          el.style.transform = 'translateY(0)'
          observer.unobserve(el)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -32px 0px',  // trigger slightly before fully in view
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    0,
        transform:  'translateY(20px)',
        transition: [
          `opacity 480ms ease-out ${delay}ms`,
          `transform 560ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        ].join(', '),
      }}
    >
      {children}
    </div>
  )
}
