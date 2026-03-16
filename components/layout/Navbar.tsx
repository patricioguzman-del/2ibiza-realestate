'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ─── Nav data ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: '/properties', label: 'Properties' },
  { href: '/areas',      label: 'Areas'      },
  { href: '/blog',       label: 'Journal'    },
  { href: '/about',      label: 'About'      },
  { href: '/sell',       label: 'Sell'       },
]

const PROPERTIES_DROPDOWN = [
  { href: '/properties',                      label: 'All Properties'   },
  { href: '/properties?type=villa',           label: 'Villas'           },
  { href: '/properties?type=apartment',       label: 'Apartments'       },
  { href: '/properties?type=finca',           label: 'Fincas'           },
  { href: '/properties?type=new-development', label: 'New Developments' },
]

const AREAS_DROPDOWN = [
  { href: '/areas/ibiza',         label: 'Ibiza'         },
  { href: '/areas/santa-eulalia', label: 'Santa Eulalia' },
  { href: '/areas/san-jose',      label: 'San José'      },
  { href: '/areas/san-antonio',   label: 'San Antonio'   },
  { href: '/areas/san-juan',      label: 'San Juan'      },
]

const DROPDOWN_MAP: Record<string, typeof PROPERTIES_DROPDOWN> = {
  '/properties': PROPERTIES_DROPDOWN,
  '/areas':      AREAS_DROPDOWN,
}

// ─── Top bar height (used to offset the main nav) ────────────────────────────

const TOPBAR_HEIGHT = 36 // px

// ─── Component ───────────────────────────────────────────────────────────────

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const isHome  = pathname === '/'
  const solidBg = scrolled || !isHome

  // Focus the first mobile menu link when the menu opens
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null)
  const hamburgerRef       = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40)
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Focus management when mobile menu toggles
  useEffect(() => {
    if (menuOpen) {
      // Small delay lets the opacity transition start before focusing
      const t = setTimeout(() => firstMobileLinkRef.current?.focus(), 50)
      return () => clearTimeout(t)
    } else {
      hamburgerRef.current?.focus()
    }
  }, [menuOpen])

  // Close mobile menu on Escape
  useEffect(() => {
    if (!menuOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [menuOpen])

  return (
    <>
      {/* ── Top bar — contact details ──────────────────────────────────── */}
      <div
        aria-label="Contact information"
        style={{
          position:        'fixed',
          top:             0,
          left:            0,
          right:           0,
          zIndex:          49,
          height:          `${TOPBAR_HEIGHT}px`,
          backgroundColor: 'var(--bg-deep)',
          borderBottom:    '1px solid rgba(245,240,232,0.10)',
          display:         'flex',
          alignItems:      'center',
          transition:      'background-color 280ms ease',
        }}
      >
        <div
          className="mx-auto w-full hidden md:flex items-center justify-end"
          style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)', gap: '28px' }}
        >
          <a
            href="tel:+34971000000"
            style={{
              fontFamily:     'var(--font-sans)',
              fontSize:       '12px',
              fontWeight:     500,
              letterSpacing:  '0.05em',
              color:          'rgba(245,240,232,0.78)',
              textDecoration: 'none',
              transition:     'color var(--transition-ui)',
              display:        'flex',
              alignItems:     'center',
              gap:            '7px',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-on-dark)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.78)')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0, opacity: 0.70 }}>
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            +34 971 000 000
          </a>

          <a
            href="mailto:hello@2ibiza.com"
            style={{
              fontFamily:     'var(--font-sans)',
              fontSize:       '12px',
              fontWeight:     500,
              letterSpacing:  '0.05em',
              color:          'rgba(245,240,232,0.78)',
              textDecoration: 'none',
              transition:     'color var(--transition-ui)',
              display:        'flex',
              alignItems:     'center',
              gap:            '7px',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-on-dark)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.78)')}
          >
            <svg width="13" height="10" viewBox="0 0 24 18" fill="none" aria-hidden="true" style={{ flexShrink: 0, opacity: 0.70 }}>
              <rect x="1" y="1" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M1 4l11 7.5L23 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            hello@2ibiza.com
          </a>
        </div>
      </div>

      {/* ── Main nav ──────────────────────────────────────────────────── */}
      <nav
        aria-label="Main navigation"
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${solidBg ? 'border-b' : ''}`}
        style={{
          top:             scrolled ? '0' : `${TOPBAR_HEIGHT}px`,
          height:          scrolled ? '60px' : '68px',
          backgroundColor: solidBg ? 'var(--bg-deep)' : 'rgba(47,58,55,0.42)',
          borderColor:     solidBg ? 'var(--border-dark)' : 'rgba(245,240,232,0.08)',
          backdropFilter:  'blur(14px)',
          transition:      'top 280ms ease, height 280ms ease, background-color 280ms ease',
        }}
      >
        <div
          className="mx-auto h-full flex items-center justify-between"
          style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
        >

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 no-underline group shrink-0" aria-label="2ibiza Real Estate — Home">
            <span
              className="font-serif"
              style={{ fontSize: '20px', fontWeight: 500, letterSpacing: '0.04em', color: 'var(--text-on-dark)' }}
            >
              2ibiza
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full mb-3 group-hover:scale-150 transition-transform duration-300"
              style={{ backgroundColor: 'var(--cta-primary-bg)' }}
              aria-hidden="true"
            />
          </Link>

          {/* Desktop: nav links + Enquire — right-aligned together */}
          <div className="hidden lg:flex items-center gap-7 shrink-0">

            {/* Nav links */}
            <ul className="flex items-center gap-7 list-none m-0 p-0" role="list">
              {NAV_LINKS.map(link => {
                const dropdown = DROPDOWN_MAP[link.href]
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/')

                if (dropdown) {
                  return (
                    <li key={link.href} className="relative group">
                      <Link
                        href={link.href}
                        className={`nav-link flex items-center gap-1 ${isActive ? 'nav-link-active' : ''}`}
                        aria-haspopup="true"
                        aria-expanded={undefined}
                      >
                        {link.label}
                        <span style={{ fontSize: '8px', opacity: 0.45, lineHeight: 1 }} aria-hidden="true">▾</span>
                      </Link>

                      {/* Dropdown opens on hover OR keyboard focus-within */}
                      <div
                        className="absolute top-full left-0 pt-2 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all"
                        style={{ transitionDuration: '180ms', transitionTimingFunction: 'ease' }}
                      >
                        <div
                          role="menu"
                          aria-label={`${link.label} submenu`}
                          style={{
                            backgroundColor: 'var(--surface-primary)',
                            borderRadius:    'var(--radius-sm)',
                            border:          '1px solid var(--border-muted)',
                            borderTop:       '2px solid var(--cta-primary-bg)',
                            boxShadow:       '0 8px 24px rgba(47,58,55,0.10), 0 2px 6px rgba(47,58,55,0.05)',
                            paddingBlock:    '8px',
                            minWidth:        '188px',
                          }}
                        >
                          {dropdown.map(item => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="dropdown-link"
                              role="menuitem"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </li>
                  )
                }

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Thin vertical divider */}
            <span
              style={{
                display:         'block',
                width:           '1px',
                height:          '16px',
                backgroundColor: 'rgba(245,240,232,0.15)',
                flexShrink:      0,
              }}
              aria-hidden="true"
            />

            {/* Enquire CTA */}
            <Link href="/contact" className="nav-enquire">
              Enquire
            </Link>

          </div>

          {/* Mobile: hamburger */}
          <button
            ref={hamburgerRef}
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={`block w-6 h-px transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
              style={{ backgroundColor: 'var(--text-on-dark)' }}
              aria-hidden="true"
            />
            <span
              className={`block w-4 h-px transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
              style={{ backgroundColor: 'var(--text-on-dark)' }}
              aria-hidden="true"
            />
            <span
              className={`block w-6 h-px transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
              style={{ backgroundColor: 'var(--text-on-dark)' }}
              aria-hidden="true"
            />
          </button>

        </div>
      </nav>

      {/* ── Mobile full-screen menu ───────────────────────────────────── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!menuOpen}
        className={`
          fixed inset-0 z-40 flex flex-col justify-center lg:hidden
          transition-all duration-500
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        style={{ backgroundColor: 'var(--bg-deep)', paddingInline: 'clamp(1.5rem, 5vw, 2.5rem)' }}
      >
        <button
          className="absolute top-6 right-8 text-2xl hover-on-dark"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation menu"
          tabIndex={menuOpen ? 0 : -1}
        >
          ✕
        </button>

        <nav aria-label="Mobile navigation">
          <ul className="space-y-8 list-none m-0 p-0" role="list">
            {NAV_LINKS.map((link, i) => (
              <li
                key={link.href}
                className={`transition-all duration-500 ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <Link
                  ref={i === 0 ? firstMobileLinkRef : undefined}
                  href={link.href}
                  className="font-serif block"
                  style={{
                    fontSize:   'clamp(2.5rem, 8vw, 3.5rem)',
                    fontWeight: 500,
                    color:      'var(--text-on-dark)',
                    transition: 'color var(--transition-ui)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--cta-primary-bg)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-on-dark)')}
                  onClick={() => setMenuOpen(false)}
                  tabIndex={menuOpen ? 0 : -1}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 pt-8 flex flex-col gap-4" style={{ borderTop: '1px solid var(--border-dark)' }}>
          <Link
            href="/contact"
            className="type-btn"
            style={{ color: 'var(--cta-primary-bg)' }}
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
          >
            Enquire →
          </Link>
          <a
            href="tel:+34971000000"
            className="type-body-sm hover-on-dark"
            tabIndex={menuOpen ? 0 : -1}
          >
            +34 971 000 000
          </a>
          <a
            href="mailto:hello@2ibiza.com"
            className="type-body-sm hover-on-dark"
            tabIndex={menuOpen ? 0 : -1}
          >
            hello@2ibiza.com
          </a>
        </div>
      </div>
    </>
  )
}
