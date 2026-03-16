'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * Fades the page content in on each route change using the Web Animations API.
 * No dependency on Framer Motion — GPU-friendly opacity-only animation.
 * Respects prefers-reduced-motion.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const ref      = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    el.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 260, easing: 'ease-out', fill: 'forwards' }
    )
  }, [pathname])

  return <div ref={ref}>{children}</div>
}
