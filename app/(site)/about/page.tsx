import Image from 'next/image'
import Link from 'next/link'
import { client } from '../../../sanity/lib/client'
import { teamMembersQuery } from '../../../sanity/lib/queries'
import { urlFor } from '../../../sanity/lib/image'
import type { Metadata } from 'next'
import { CONTACT } from '../../../lib/constants'

export const metadata: Metadata = {
  title: 'About 2ibiza Real Estate',
  description: 'A boutique real estate agency with over 9 years of experience in the Ibiza property market.',
}

export const revalidate = 60

const VALUES = [
  {
    n:     '01',
    title: 'Transparency',
    desc:  "We tell our clients the truth about a property's value, history and potential — even when it's not what they want to hear.",
  },
  {
    n:     '02',
    title: 'Discretion',
    desc:  "Many of our transactions are never publicised. Our clients' privacy is something we protect with the same care as our own.",
  },
  {
    n:     '03',
    title: 'Expertise',
    desc:  'From legal due diligence to interior renovation, we have a trusted network of professionals to guide every step of the process.',
  },
]

// Placeholder team shown when no Sanity data yet
const TEAM_PLACEHOLDER = [
  { name: 'Philip Gould',    role: 'Founder & Director'  },
  { name: 'Team Member',     role: 'Property Consultant' },
]

export default async function AboutPage() {
  const team = await client.fetch(teamMembersQuery).catch(() => [])

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: 'var(--bg-deep)',
          paddingTop:      'clamp(6rem, 10vw, 9rem)',
          paddingBottom:   'clamp(3.5rem, 6vw, 5rem)',
          borderBottom:    '1px solid var(--border-dark)',
        }}
      >
        <div
          className="mx-auto"
          style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
        >
          <div className="eyebrow-row mb-[10px]">
            <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>Our Story</span>
          </div>
          <h1
            className="font-serif"
            style={{
              color:         'var(--text-on-dark)',
              fontWeight:    500,
              letterSpacing: '-0.025em',
              fontSize:      'clamp(2.75rem, 6vw, 5rem)',
              lineHeight:    1.0,
              maxWidth:      '640px',
              marginTop:     '12px',
            }}
          >
            Ibiza, <em className="italic">handled</em><br />
            with care.
          </h1>
          <p
            className="type-body"
            style={{
              color:     'rgba(245,240,232,0.68)',
              maxWidth:  '460px',
              marginTop: '1.25rem',
            }}
          >
            A boutique agency built on local knowledge, lasting relationships, and absolute discretion.
          </p>
        </div>
      </div>

      {/* ── Story ────────────────────────────────────────────────────── */}
      <div className="section-major" style={{ backgroundColor: 'var(--bg-canvas)' }}>
        <div
          className="container-lg grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <div>
            <div className="eyebrow-row mb-[10px]">
              <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>The Agency</span>
            </div>
            <h2
              className="font-serif"
              style={{
                color:        'var(--text-primary)',
                fontWeight:   500,
                fontSize:     'clamp(1.875rem, 3vw, 2.5rem)',
                marginBottom: '1.5rem',
                marginTop:    '10px',
                letterSpacing: '-0.02em',
              }}
            >
              Who We Are
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                "2ibiza Real Estate was founded by a team of property professionals who fell in love with Ibiza — and never quite left. Over nine years, we have built a reputation for honesty, discretion, and an intimate knowledge of the island's most exceptional properties.",
                "We are not the biggest agency on the island. We are the one our clients trust to act in their best interests, whether that means introducing them to an off-market listing that never appears online, or advising them to walk away from a property that looks better on paper than in reality.",
                "Our clients include entrepreneurs, artists, families and investors from across Europe and beyond. What unites them is a desire for something more than a transaction — a home, a base, a piece of Ibiza they can call their own.",
              ].map((text, i) => (
                <p key={i} className="type-body-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  {text}
                </p>
              ))}
            </div>
          </div>
          {/* Image — replace with team/lifestyle shot when photography available */}
          <div className="relative" style={{ height: 'clamp(320px, 45vw, 500px)' }}>
            <Image
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=1000&fit=crop"
              alt="Ibiza luxury villa"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

      {/* ── Values ───────────────────────────────────────────────────── */}
      <div className="section-major" style={{ backgroundColor: 'var(--bg-section-muted)' }}>
        <div className="container-lg">
          <div className="eyebrow-row mb-[10px]">
            <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>How We Work</span>
          </div>
          <h2
            className="font-serif"
            style={{
              color:         'var(--text-primary)',
              fontWeight:    500,
              fontSize:      'clamp(1.875rem, 3vw, 2.5rem)',
              letterSpacing: '-0.02em',
              marginTop:     '10px',
              marginBottom:  'clamp(2.5rem, 4vw, 4rem)',
            }}
          >
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <div
                key={v.title}
                style={{
                  borderTop:     '1px solid var(--border-soft)',
                  borderLeft:    i > 0 ? '1px solid var(--border-soft)' : 'none',
                  paddingTop:    'clamp(1.5rem, 2.5vw, 2rem)',
                  paddingBottom: 'clamp(1.5rem, 2.5vw, 2rem)',
                  paddingLeft:   i > 0 ? 'clamp(1.25rem, 3vw, 2.5rem)' : '0',
                  paddingRight:  i < 2 ? 'clamp(1.25rem, 3vw, 2.5rem)' : '0',
                }}
              >
                <p
                  className="font-serif"
                  style={{
                    color:         'var(--cta-primary-bg)',
                    fontSize:      '1.125rem',
                    fontWeight:    400,
                    letterSpacing: '0.02em',
                    marginBottom:  '1rem',
                    opacity:       0.85,
                  }}
                >
                  {v.n}
                </p>
                <h3
                  className="font-serif"
                  style={{
                    color:        'var(--text-primary)',
                    fontWeight:   500,
                    fontSize:     'clamp(1.25rem, 1.8vw, 1.5rem)',
                    letterSpacing: '-0.01em',
                    marginBottom: '0.75rem',
                  }}
                >
                  {v.title}
                </h3>
                <p className="type-body-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Team ─────────────────────────────────────────────────────── */}
      <div className="section-major" style={{ backgroundColor: 'var(--bg-canvas)' }}>
        <div className="container-lg">
          <div className="eyebrow-row mb-[10px]">
            <span className="type-eyebrow" style={{ color: 'var(--accent-stone)' }}>The People</span>
          </div>
          <h2
            className="font-serif"
            style={{
              color:         'var(--text-primary)',
              fontWeight:    500,
              fontSize:      'clamp(1.875rem, 3vw, 2.5rem)',
              letterSpacing: '-0.02em',
              marginTop:     '10px',
              marginBottom:  'clamp(2.5rem, 4vw, 4rem)',
            }}
          >
            The Team
          </h2>

          {team.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {team.map((member: any) => (
                <div key={member._id}>
                  <div
                    className="relative overflow-hidden mb-5"
                    style={{ width: '100%', aspectRatio: '3 / 4', maxHeight: '340px' }}
                  >
                    {member.photo ? (
                      <Image
                        src={urlFor(member.photo).width(600).height(800).fit('crop').url()}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--bg-canvas-soft)' }}
                      >
                        <span className="font-serif" style={{ fontSize: '2.5rem', color: 'var(--text-tertiary)' }}>
                          {member.name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3
                    className="font-serif"
                    style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '1.25rem', letterSpacing: '-0.01em' }}
                  >
                    {member.name}
                  </h3>
                  <p className="type-eyebrow mt-1" style={{ color: 'var(--cta-primary-bg)', letterSpacing: '0.14em' }}>
                    {member.role}
                  </p>
                  {member.languages && (
                    <p className="type-caption mt-2" style={{ color: 'var(--text-tertiary)' }}>
                      {member.languages.join(' · ')}
                    </p>
                  )}
                  {member.bio && (
                    <p className="type-body-sm mt-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                      {member.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Placeholder cards — replace with real team via Sanity */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {TEAM_PLACEHOLDER.map((member, i) => (
                <div key={i}>
                  <div
                    className="relative overflow-hidden mb-5"
                    style={{
                      width:           '100%',
                      aspectRatio:     '3 / 4',
                      maxHeight:       '320px',
                      backgroundColor: 'var(--bg-canvas-soft)',
                      display:         'flex',
                      alignItems:      'center',
                      justifyContent:  'center',
                    }}
                  >
                    <span
                      className="font-serif"
                      style={{ fontSize: '3rem', color: 'var(--text-tertiary)', opacity: 0.35 }}
                    >
                      {member.name[0]}
                    </span>
                  </div>
                  <h3
                    className="font-serif"
                    style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '1.25rem', letterSpacing: '-0.01em' }}
                  >
                    {member.name}
                  </h3>
                  <p className="type-eyebrow mt-1" style={{ color: 'var(--cta-primary-bg)', letterSpacing: '0.14em' }}>
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Closing CTA ──────────────────────────────────────────────── */}
      <div
        className="section-major-dark"
        style={{
          backgroundColor: 'var(--bg-deep)',
          borderTop:       '1px solid var(--border-dark)',
        }}
      >
        <div className="container-lg">
          <div className="eyebrow-row mb-[10px]">
            <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>Work With Us</span>
          </div>
          <h2
            className="font-serif"
            style={{
              color:         'var(--text-on-dark)',
              fontWeight:    500,
              fontSize:      'clamp(2rem, 4vw, 3.25rem)',
              letterSpacing: '-0.025em',
              lineHeight:    1.1,
              maxWidth:      '560px',
              marginTop:     '10px',
              marginBottom:  '1.25rem',
            }}
          >
            Ready to start the conversation?
          </h2>
          <p
            className="type-body"
            style={{
              color:        'rgba(245,240,232,0.68)',
              maxWidth:     '480px',
              lineHeight:   1.75,
              marginBottom: '2.5rem',
            }}
          >
            Whether you are buying, selling, or simply exploring what Ibiza has to offer — we are here to guide you, without pressure and without pretence.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">
              Get in Touch
            </Link>
            <Link href="/properties" className="btn-ghost-dark">
              View Properties
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
