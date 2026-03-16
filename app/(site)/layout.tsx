import type { Metadata } from 'next'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import PageTransition from '../../components/ui/PageTransition'
import ErrorBoundary from '../../components/ui/ErrorBoundary'
import WhatsAppButton from '../../components/ui/WhatsAppButton'
import '../globals.css'

export const metadata: Metadata = {
  title: { default: '2ibiza Real Estate — Luxury Properties in Ibiza', template: '%s | 2ibiza Real Estate' },
  description: 'Boutique real estate agency specialising in the finest luxury villas, fincas and apartments for sale in Ibiza.',
  keywords: ['Ibiza real estate', 'luxury villas Ibiza', 'property for sale Ibiza', 'boutique agency Ibiza'],
  openGraph: {
    type:     'website',
    siteName: '2ibiza Real Estate',
    locale:   'en_GB',
    images: [{
      url:    '/og-default.jpg',
      width:  1200,
      height: 630,
      alt:    '2ibiza Real Estate — Luxury Properties in Ibiza',
    }],
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <ErrorBoundary>
          <PageTransition>{children}</PageTransition>
        </ErrorBoundary>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
