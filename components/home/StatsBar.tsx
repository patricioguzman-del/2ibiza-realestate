'use client'

import { useEffect, useRef, useState } from 'react'

const STATS = [
  { value: 240, prefix: '€', suffix: 'M+', label: 'In Sales' },
  { value: 9, prefix: '', suffix: '+', label: 'Years on the Island' },
  { value: 3, prefix: '', suffix: '', label: 'Languages Spoken' },
  { value: 100, prefix: '', suffix: '%', label: 'Independent' },
]

function Counter({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          let startTime: number
          const duration = 1800
          const tick = (ts: number) => {
            if (!startTime) startTime = ts
            const progress = Math.min((ts - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * value))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.6 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  )
}

export default function StatsBar() {
  return (
    <section
      className="section-secondary"
      style={{ backgroundColor: 'var(--bg-section-muted)' }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="px-8 lg:px-12 py-10 lg:py-0 text-center lg:text-left"
              style={{
                borderRight: i < STATS.length - 1 ? '1px solid rgba(30,42,47,0.12)' : 'none',
              }}
            >
              <div
                className="font-serif leading-none"
                style={{
                  fontSize: 'clamp(3rem, 5vw, 5rem)',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }}
              >
                <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <p
                className="type-eyebrow mt-3"
                style={{ color: 'var(--text-secondary)', letterSpacing: '0.16em' }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
