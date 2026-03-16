import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────────────────────────
//
// This shape is intentionally data-source-agnostic.
// Replace METRICS with an async fetch() from Supabase, a Sanity
// "marketSnapshot" document, or a scraped endpoint — no JSX changes needed.

type TrendDir = 'up' | 'down' | 'stable'

interface Metric {
  /** Primary display value — number string, price, or percentage */
  value:     string
  /** Short label beneath the value */
  label:     string
  /** Trend line — arrow + context, e.g. "↑ +4.1% year on year" */
  trend:     string
  direction: TrendDir
}

// ─── Placeholder data ─────────────────────────────────────────────────────────
//
// Snapshot: March 2026. Update manually or connect to a live data source.

const METRICS: Metric[] = [
  {
    value:     '14',
    label:     'New Listings This Month',
    trend:     '↑ +3 vs February',
    direction: 'up',
  },
  {
    value:     '€6.2M',
    label:     'Average Villa Price',
    trend:     '↑ +4.1% year on year',
    direction: 'up',
  },
  {
    value:     '€890K',
    label:     'Average Apartment Price',
    trend:     '↑ +2.8% year on year',
    direction: 'up',
  },
  {
    value:     '47',
    label:     'Avg. Days on Market',
    trend:     '↓ −6 days vs Q1 2025',
    direction: 'down',
  },
]

// Example article teasers — replace with live Sanity blog data
const JOURNAL_TEASERS = [
  { title: 'Ibiza Property Market Outlook 2026',            href: '/blog' },
  { title: 'Where Prices Are Rising Fastest in Ibiza',      href: '/blog' },
  { title: 'North vs South Ibiza: Comparing the Markets',   href: '/blog' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function trendColor(dir: TrendDir): string {
  // Deliberately muted — editorial tone, not a finance dashboard
  if (dir === 'up')   return 'var(--cta-primary-bg)'   // Aged Brass — warm, positive
  if (dir === 'down') return 'var(--cta-primary-bg)'   // Same — neutral-warm, not alarming
  return 'var(--text-tertiary)'
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function MarketIntelligence() {
  return (
    <section
      className="section-major"
      style={{ backgroundColor: 'var(--bg-canvas-soft)' }}
      aria-labelledby="market-intel-heading"
    >
      <div
        className="mx-auto"
        style={{
          maxWidth:      'var(--content-lg)',
          paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
        }}
      >

        {/* ── Section header ─────────────────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          style={{ marginBottom: 'clamp(40px, 5vw, 64px)' }}
        >
          <div style={{ maxWidth: '520px' }}>
            <div className="eyebrow-row mb-[10px]">
              <span className="type-eyebrow" style={{ color: 'var(--cta-primary-bg)' }}>
                Ibiza Market Intelligence
              </span>
            </div>

            <h2
              id="market-intel-heading"
              className="font-serif"
              style={{
                color:         'var(--text-primary)',
                fontWeight:    500,
                letterSpacing: '-0.025em',
                marginBottom:  '22px',
              }}
            >
              A clear view of Ibiza&apos;s<br className="hidden sm:block" />
              evolving property market.
            </h2>

            <p
              className="type-body"
              style={{
                color:        'var(--text-secondary)',
                lineHeight:   1.78,
                maxWidth:     '520px',
                marginBottom: 0,
              }}
            >
              Track the latest movements in Ibiza real estate — from new
              listings and pricing trends to shifts in buyer demand across
              the island.
            </p>
          </div>

          {/* Header CTA — aligned to bottom on desktop */}
          <Link
            href="/blog"
            className="section-more-link shrink-0"
          >
            Read the latest market insights
            <span className="block h-px bg-current" style={{ width: '24px' }} />
          </Link>
        </div>

        {/* ── 4-metric grid ──────────────────────────────────────────── */}
        <div
          className="market-metrics-grid market-metrics-grid--4"
          role="list"
          aria-label="Market metrics"
        >
          {METRICS.map((metric, i) => (
            <div
              key={metric.label}
              role="listitem"
              className="market-metric-item"
              style={{
                borderRight: i < METRICS.length - 1
                  ? '1px solid var(--border-muted)'
                  : 'none',
              }}
            >
              {/* Brass accent rule above value */}
              <div
                aria-hidden="true"
                style={{
                  width:           '20px',
                  height:          '1px',
                  backgroundColor: 'var(--cta-primary-bg)',
                  marginBottom:    'clamp(14px, 2vw, 20px)',
                }}
              />

              {/* Primary value */}
              <div
                className="font-serif"
                style={{
                  fontSize:      'clamp(2.25rem, 3.2vw, 3.125rem)',
                  fontWeight:    500,
                  lineHeight:    1.0,
                  letterSpacing: '-0.025em',
                  color:         'var(--text-primary)',
                  marginBottom:  'clamp(10px, 1.5vw, 14px)',
                }}
              >
                {metric.value}
              </div>

              {/* Label */}
              <p
                className="type-eyebrow"
                style={{
                  color:         'var(--text-secondary)',
                  letterSpacing: '0.10em',
                  lineHeight:    1.4,
                  marginBottom:  '10px',
                }}
              >
                {metric.label}
              </p>

              {/* Trend indicator */}
              <p
                className="type-caption"
                style={{
                  color:        trendColor(metric.direction),
                  lineHeight:   1.3,
                  marginBottom: 0,
                  fontWeight:   500,
                }}
              >
                {metric.trend}
              </p>
            </div>
          ))}
        </div>

        {/* ── Journal bridge ─────────────────────────────────────────── */}
        <div
          style={{
            marginTop:  'clamp(40px, 5vw, 56px)',
            paddingTop: 'clamp(28px, 3.5vw, 36px)',
            borderTop:  '1px solid var(--border-muted)',
          }}
        >
          <div
            className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-10 lg:gap-16"
          >
            {/* Section label */}
            <div className="shrink-0" style={{ paddingTop: '3px' }}>
              <p
                className="type-eyebrow"
                style={{
                  color:        'var(--cta-primary-bg)',
                  marginBottom: 0,
                  whiteSpace:   'nowrap',
                }}
              >
                From the Journal
              </p>
            </div>

            {/* Article teasers */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-px"
              style={{ backgroundColor: 'var(--border-muted)' }}
            >
              {JOURNAL_TEASERS.map((article) => (
                <Link
                  key={article.title}
                  href={article.href}
                  className="group block no-underline"
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    padding:         'clamp(16px, 2vw, 20px) clamp(16px, 2vw, 24px)',
                  }}
                >
                  <p
                    className="font-serif"
                    style={{
                      fontSize:      'clamp(0.9375rem, 1.3vw, 1.0625rem)',
                      fontWeight:    400,
                      letterSpacing: '-0.01em',
                      lineHeight:    1.45,
                      color:         'var(--text-primary)',
                      marginBottom:  '10px',
                      transition:    'color var(--transition-smooth)',
                    }}
                  >
                    {article.title}
                  </p>
                  <span
                    className="type-caption flex items-center gap-1.5"
                    style={{
                      color:      'var(--cta-primary-bg)',
                      fontWeight: 500,
                    }}
                  >
                    Read article
                    <span
                      className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden
                    >
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Data footer ────────────────────────────────────────────── */}
        <div
          style={{
            marginTop:      'clamp(28px, 3.5vw, 36px)',
            paddingTop:     '18px',
            borderTop:      '1px solid var(--border-muted)',
            display:        'flex',
            flexDirection:  'column',
            gap:            '8px',
          }}
        >
          <p
            className="type-caption"
            style={{
              color:        'var(--text-tertiary)',
              marginBottom: 0,
              lineHeight:   1.6,
              maxWidth:     '66ch',
            }}
          >
            Data based on internal listings, market monitoring, and publicly
            available property data across Ibiza. Snapshot: March 2026.
          </p>
          <div className="flex items-center gap-6 flex-wrap">
            <Link
              href="/blog"
              className="type-caption hover-opacity-72"
              style={{
                color:          'var(--cta-primary-bg)',
                textDecoration: 'none',
                fontWeight:     500,
                display:        'inline-flex',
                alignItems:     'center',
                gap:            '4px',
                marginBottom:   0,
              }}
            >
              Methodology &amp; sources
              <span aria-hidden>→</span>
            </Link>
            <p
              className="type-caption"
              style={{ color: 'var(--text-tertiary)', marginBottom: 0, opacity: 0.6 }}
            >
              Updated monthly · Ibiza market estimates
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
