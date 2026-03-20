import Link from 'next/link'

// ─── Footer data ───────────────────────────────────────────────────────────

const PROPERTY_LINKS = [
  { href: '/properties',                      label: 'All Properties'   },
  { href: '/properties?type=villa',           label: 'Villas'           },
  { href: '/properties?type=apartment',       label: 'Apartments'       },
  { href: '/properties?type=new-development', label: 'New Developments' },
]

const AREA_LINKS = [
  { href: '/areas/ibiza',         label: 'Ibiza'         },
  { href: '/areas/santa-eulalia', label: 'Santa Eulalia' },
  { href: '/areas/san-jose',      label: 'San José'      },
  { href: '/areas/san-antonio',   label: 'San Antonio'   },
  { href: '/areas/san-juan',      label: 'San Juan'      },
]

const NAV_LINKS = [
  { href: '/about',   label: 'About'        },
  { href: '/blog',    label: 'Journal'      },
  { href: '/sell',    label: 'Sell With Us' },
  { href: '/contact', label: 'Contact'      },
]

const SOCIAL = [
  {
    href: 'https://www.instagram.com/2ibiza',
    label: 'Instagram',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: 'https://www.facebook.com/2ibiza',
    label: 'Facebook',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: 'https://www.linkedin.com/company/2ibiza',
    label: 'LinkedIn',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
]

const LEGAL = [
  { href: '/privacy', label: 'Privacy Policy'   },
  { href: '/terms',   label: 'Terms of Service' },
  { href: '/cookies', label: 'Cookie Policy'    },
]

// ─── Component ─────────────────────────────────────────────────────────────

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ backgroundColor: 'var(--bg-deep)', borderTop: '1px solid rgba(20,20,19,0.10)' }}>

      {/* ── Main grid ──────────────────────────────────────────────── */}
      {/*
        Desktop  (lg): 4-column grid — brand (wider) + Properties + Areas + Navigate
        Tablet  (md):  2-column grid — brand + Properties | Areas + Navigate
        Mobile  (sm):  single-column stack
      */}
      <div
        className="mx-auto"
        style={{
          maxWidth: 'var(--content-lg)',
          paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
          paddingTop:    'clamp(52px, 7vw, 72px)',
          paddingBottom: 'clamp(44px, 6vw, 60px)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 lg:gap-0">

          {/* ── Brand column ──────────────────────────────────────── */}
          <div className="lg:pr-10">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-1 no-underline group mb-5 w-fit">
              <span
                className="font-serif"
                style={{ fontSize: '22px', fontWeight: 500, letterSpacing: '0.04em', color: 'var(--text-on-dark)' }}
              >
                2ibiza
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full mb-2 group-hover:scale-150 transition-transform duration-300"
                style={{ backgroundColor: 'var(--cta-primary-bg)' }}
              />
            </Link>

            {/* Tagline */}
            <p
              className="type-body-sm"
              style={{
                color:        'var(--text-secondary)',
                lineHeight:   1.72,
                maxWidth:     '280px',
                marginBottom: '22px',
              }}
            >
              A boutique real estate agency specializing in exceptional
              properties across Ibiza.
            </p>

            {/* Contact */}
            <div style={{ marginBottom: '22px' }}>
              <a
                href="mailto:info@2ibiza.com"
                className="hover-gold-muted type-body-sm block"
                style={{ marginBottom: '5px' }}
              >
                info@2ibiza.com
              </a>
              <a
                href="tel:+34971000000"
                className="hover-on-dark type-body-sm"
              >
                +34 971 000 000
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-5">
              {SOCIAL.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  className="hover-on-dark-gold"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-secondary)', display: 'flex' }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Properties column ──────────────────────────────────── */}
          <FooterColumn title="Properties" links={PROPERTY_LINKS} />

          {/* ── Areas column ───────────────────────────────────────── */}
          <FooterColumn title="Areas" links={AREA_LINKS} />

          {/* ── Navigate column ────────────────────────────────────── */}
          <FooterColumn title="Navigate" links={NAV_LINKS} />

        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--border-dark)' }}>
        <div
          className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            maxWidth:     'var(--content-lg)',
            paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
            paddingBlock:  '22px',
          }}
        >
          <p
            className="type-caption"
            style={{ color: 'var(--text-secondary)', letterSpacing: '0.04em' }}
          >
            © {year} 2ibiza Real Estate. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-6">
            {LEGAL.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="type-caption hover-on-dark"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  )
}

// ─── FooterColumn ──────────────────────────────────────────────────────────

interface FooterColumnProps {
  title: string
  links: { href: string; label: string }[]
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    // footer-col-sep adds border-left only on lg+ breakpoint (see globals.css)
    <div className="footer-col-sep lg:px-8">
      {/*
        footer-col-title: 13px / 0.14em / uppercase — slightly warmer
        than type-eyebrow, clearly dominates the link list below.
      */}
      <p
        className="footer-col-title mb-6"
        style={{ color: 'var(--text-secondary)', marginTop: 0 }}
      >
        {title}
      </p>
      <ul
        className="list-none p-0 m-0"
        style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}
      >
        {links.map(link => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="hover-on-dark"
              style={{
                fontFamily:    'var(--font-sans)',
                fontSize:      '14px',
                fontWeight:    400,
                lineHeight:    1.45,
                letterSpacing: '0.01em',
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
