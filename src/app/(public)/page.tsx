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
import SectionDivider from '@/components/SectionDivider'

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
  alternates: {
    canonical: 'https://www.pegrio.com',
  },
}

export default function Home() {
  // Combined JSON-LD schemas
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://www.pegrio.com/#business',
      name: 'Pegrio',
      description: 'Website design agency for local businesses. High-performance websites for home service businesses, med spas, and restaurants.',
      url: 'https://www.pegrio.com',
      telephone: '+1-832-555-0100',
      email: 'c.hatfield309@gmail.com',
      founder: {
        '@type': 'Person',
        name: 'Chris Hatfield',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Katy',
        addressRegion: 'TX',
        postalCode: '77494',
        addressCountry: 'US',
      },
      areaServed: [
        { '@type': 'City', name: 'Houston' },
        { '@type': 'City', name: 'Katy' },
        { '@type': 'Country', name: 'United States' },
      ],
      priceRange: '$$',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
      sameAs: [],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Pegrio',
      url: 'https://www.pegrio.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.pegrio.com/work',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Website Design',
      provider: { '@id': 'https://www.pegrio.com/#business' },
      areaServed: { '@type': 'Country', name: 'United States' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Website Packages',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: 'Starter Package' },
            price: '2000',
            priceCurrency: 'USD',
          },
          {
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: 'Growth Package' },
            price: '5000',
            priceCurrency: 'USD',
          },
          {
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: 'Enterprise Package' },
            price: '8000',
            priceCurrency: 'USD',
          },
        ],
      },
    },
  ]

  return (
    <>
      <Script
        id="schema-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <HeroSection />
      <SocialProofBar />
      <SectionDivider type="wave" from="#F8F5F0" to="#FFFFFF" />
      <IndustriesSection />
      <SectionDivider type="angle" from="#FFFFFF" to="#F8F5F0" />
      <HowItWorksSection />
      <SectionDivider type="curve" from="#F8F5F0" to="#FFFFFF" />
      <PricingPreview />
      <SectionDivider type="wave" from="#FFFFFF" to="#F8F5F0" />
      <PortfolioPreview />
      <SectionDivider type="angle" from="#F8F5F0" to="#FFFFFF" />
      <TrustSection />
      <SectionDivider type="curve" from="#FFFFFF" to="#F8F5F0" />
      <FAQSection />
      <FinalCTA />
      <ScrollPopup />
    </>
  )
}
