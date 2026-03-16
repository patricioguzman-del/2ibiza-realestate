/**
 * Skeleton placeholder that matches the PropertyCard dimensions.
 * Used in Suspense fallbacks while property data loads.
 */
export default function SkeletonCard() {
  return (
    <div
      style={{
        backgroundColor: 'var(--surface-primary)',
        border:          '1px solid var(--border-muted)',
      }}
    >
      <div className="animate-pulse">
        {/* Image area — 4:3 to match PropertyCard */}
        <div
          style={{
            aspectRatio:     '4 / 3',
            backgroundColor: 'var(--bg-section-muted)',
          }}
        />

        {/* Info block */}
        <div style={{ padding: '20px 24px 24px' }}>
          {/* Area eyebrow */}
          <div
            style={{
              height:          '10px',
              width:           '64px',
              backgroundColor: 'var(--border-soft)',
              marginBottom:    '10px',
            }}
          />
          {/* Title */}
          <div
            style={{
              height:          '20px',
              width:           '78%',
              backgroundColor: 'var(--border-soft)',
              marginBottom:    '6px',
            }}
          />
          {/* Attrs */}
          <div
            style={{
              height:          '14px',
              width:           '55%',
              backgroundColor: 'var(--border-muted)',
              marginBottom:    '18px',
            }}
          />
          {/* Rule */}
          <div
            style={{
              height:          '1px',
              backgroundColor: 'var(--border-muted)',
              marginBottom:    '18px',
            }}
          />
          {/* Price + CTA row */}
          <div className="flex items-center justify-between">
            <div style={{ height: '20px', width: '72px', backgroundColor: 'var(--border-soft)' }} />
            <div style={{ height: '13px', width: '96px', backgroundColor: 'var(--border-muted)' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Responsive skeleton grid — drop-in replacement for a PropertyCard grid
 * while data is loading.
 */
export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      style={{ rowGap: '40px', columnGap: '32px' }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
