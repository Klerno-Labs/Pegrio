import type { Metadata } from 'next'
import Script from 'next/script'
import HeroSection from '@/components/home/HeroSection'
import SocialProofBar from '@/components/home/SocialProofBar'
import IndustriesSection from '@/components/home/IndustriesSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import PricingPreview from '@/components/home/PricingPreview'
import PortfolioPreview from '@/components/home/PortfolioPreview'
import TrustSection from '@/components/home/TrustSection'
import FAQSection from '@/components/home/FAQSection'
import FinalCTA from '@/components/home/FinalCTA'
import ScrollPopup from '@/components/home/ScrollPopup'

export const metadata: Metadata = {
  title: 'Houston Website Design for Local Businesses | Pegrio',
  description: 'Pegrio builds high-performance websites for home service businesses, med spas, and restaurants in Houston, Katy, and across the US. Designed to rank and generate real leads.',
  openGraph: {
    title: 'Houston Website Design for Local Businesses | Pegrio',
    description: 'Pegrio builds high-performance websites for home service businesses, med spas, and restaurants in Houston, Katy, and across the US. Designed to rank and generate real leads.',
    url: 'https://www.pegrio.com',
    siteName: 'Pegrio',
    locale: 'en_US',
    type: 'website',
  },
}

export default function Home() {
  // LocalBusiness JSON-LD Schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Pegrio',
    description: 'Website design agency for local businesses',
    url: 'https://www.pegrio.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Katy',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    areaServed: ['Houston', 'Katy', 'United States'],
  }

  return (
    <>
      <Script
        id="schema-localbusiness"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <HeroSection />
      <SocialProofBar />
      <IndustriesSection />
      <HowItWorksSection />
      <PricingPreview />
      <PortfolioPreview />
      <TrustSection />
      <FAQSection />
      <FinalCTA />
      <ScrollPopup />
    </>
  )
}
