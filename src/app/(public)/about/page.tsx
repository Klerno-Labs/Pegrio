import type { Metadata } from 'next'
import AboutContent from '@/components/about/AboutContent'

export const metadata: Metadata = {
  title: 'About Pegrio | Houston Website Agency',
  description: 'Pegrio is a Houston-based website agency founded by Chris Hatfield. Serving Katy, Houston, and clients across the US with high-performance, lead-generating websites.',
  openGraph: {
    title: 'About Pegrio | Houston Website Agency',
    description: 'Pegrio is a Houston-based website agency founded by Chris Hatfield. Serving Katy, Houston, and clients across the US with high-performance, lead-generating websites.',
    url: 'https://www.pegrio.com/about',
  },
}

export default function AboutPage() {
  return <AboutContent />
}
