import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '2ibiza Studio',
  robots: { index: false },
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
