import Image from 'next/image'
import { client } from '../../../sanity/lib/client'
import { teamMembersQuery } from '../../../sanity/lib/queries'
import { urlFor } from '../../../sanity/lib/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About 2ibiza Real Estate',
  description: 'A boutique real estate agency with over 9 years of experience in the Ibiza property market.',
}

export const revalidate = 60

const VALUES = [
  {
    title: 'Transparency',
    desc:  "We tell our clients the truth about a property's value, history and potential — even when it's not what they want to hear.",
  },
  {
    title: 'Discretion',
    desc:  "Many of our transactions are never publicised. Our clients' privacy is something we protect with the same care as our own.",
  },
  {
    title: 'Expertise',
    desc:  'From legal due diligence to interior renovation, we have a trusted network of professionals to guide every step of the process.',
  },
]

export default async function AboutPage() {
  const team = await client.fetch(teamMembersQuery).catch(() => [])

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: 'var(--bg-deep)',
          paddingTop:      'clamp(6rem, 10vw, 8rem)',
          paddingBottom:   'clamp(3rem, 5vw, 4rem)',
          position:        'relative',
          overflow:        'hidden',
        }}
      >
        <div
          style={{
            position:        'absolute',
            top:             0,
            right:           0,
            width:           '24rem',
            height:          '24rem',
            borderRadius:    '50%',
            backgroundColor: 'var(--cta-primary-bg)',
            filter:          'blur(96px)',
            opacity:         0.08,
            pointerEvents:   'none',
          }}
        />
        <div
          className="mx-auto relative"
          style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
        >
          <div className="eyebrow-row mb-[10px]">
            <span className="type-eyebrow" style={{ color: 'var(--accent-sand)' }}>Our Story</span>
          </div>
          <h1
            className="font-serif"
            style={{
              color:         'var(--text-on-dark)',
              fontWeight:    400,
              letterSpacing: '-0.025em',
              fontSize:      'clamp(2.75rem, 6vw, 5rem)',
              lineHeight:    1.0,
              maxWidth:      '640px',
              marginTop:     '12px',
            }}
          >
            Ibiza, <em className="italic">handled</em> with care.
          </h1>
        </div>
      </div>

      {/* ── Story ──────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: 'var(--bg-canvas)', paddingBlock: 'clamp(3.5rem, 6vw, 5rem)' }}>
        <div
          className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
        >
          <div>
            <h2
              className="font-serif"
              style={{
                color:        'var(--text-primary)',
                fontWeight:   400,
                fontSize:     'clamp(1.875rem, 3vw, 2.5rem)',
                marginBottom: '1.5rem',
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

      {/* ── Values ─────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: 'var(--bg-canvas-soft)', paddingBlock: 'clamp(3.5rem, 6vw, 5rem)' }}>
        <div
          className="mx-auto"
          style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
        >
          <h2
            className="font-serif text-center"
            style={{
              color:        'var(--text-primary)',
              fontWeight:   400,
              fontSize:     'clamp(1.875rem, 3vw, 2.5rem)',
              marginBottom: 'clamp(2.5rem, 4vw, 4rem)',
            }}
          >
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {VALUES.map(v => (
              <div key={v.title} className="text-center">
                <h3
                  className="font-serif"
                  style={{
                    color:        'var(--text-primary)',
                    fontWeight:   400,
                    fontSize:     'clamp(1.25rem, 1.8vw, 1.5rem)',
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

      {/* ── Team ───────────────────────────────────────────────────── */}
      {team.length > 0 && (
        <div style={{ backgroundColor: 'var(--surface-primary)', paddingBlock: 'clamp(3.5rem, 6vw, 5rem)' }}>
          <div
            className="mx-auto"
            style={{ maxWidth: 'var(--content-lg)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
          >
            <h2
              className="font-serif text-center"
              style={{
                color:        'var(--text-primary)',
                fontWeight:   400,
                fontSize:     'clamp(1.875rem, 3vw, 2.5rem)',
                marginBottom: 'clamp(2.5rem, 4vw, 4rem)',
              }}
            >
              The Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {team.map((member: any) => (
                <div key={member._id} className="text-center">
                  <div
                    className="relative rounded-full overflow-hidden mx-auto mb-6"
                    style={{ width: '192px', height: '192px' }}
                  >
                    {member.photo ? (
                      <Image
                        src={urlFor(member.photo).width(400).height(400).fit('crop').url()}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--bg-canvas-soft)' }}
                      >
                        <span className="font-serif" style={{ fontSize: '2rem', color: 'var(--text-tertiary)' }}>
                          {member.name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3
                    className="font-serif"
                    style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '1.25rem' }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="type-eyebrow mt-1"
                    style={{ color: 'var(--accent-stone)', letterSpacing: '0.14em' }}
                  >
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
          </div>
        </div>
      )}
    </>
  )
}
