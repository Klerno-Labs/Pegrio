import type { Metadata } from 'next'
import Script from 'next/script'
import AppsHero from '@/components/apps/AppsHero'
import ValueProposition from '@/components/apps/ValueProposition'
import HowItWorks from '@/components/apps/HowItWorks'
import AppCards from '@/components/apps/AppCards'
import ComingSoonGrid from '@/components/apps/ComingSoonGrid'
import WhyPegrio from '@/components/apps/WhyPegrio'
import AppsCTA from '@/components/apps/AppsCTA'
import AIGuideWidget from '@/components/apps/AIGuideWidget'
import SectionDivider from '@/components/SectionDivider'

export const metadata: Metadata = {
  title: 'Industry Apps Built to Convert | Pegrio',
  description: 'Custom web apps for hemp retail, med spas, restaurants, and home services. Built for your industry, launched in days, supported every month.',
  openGraph: {
    title: 'Industry Apps Built to Convert | Pegrio',
    description: 'Custom web apps for hemp retail, med spas, restaurants, and home services. Built for your industry, launched in days, supported every month.',
    url: 'https://www.pegrio.com/apps',
  },
  alternates: {
    canonical: 'https://www.pegrio.com/apps',
  },
}

export default function AppsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Pegrio Industry Apps',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Custom pricing based on business needs',
    },
    provider: {
      '@type': 'Organization',
      name: 'Pegrio',
      url: 'https://www.pegrio.com',
    },
  }

  return (
    <>
      <Script
        id="apps-schema-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <AppsHero />
      <ValueProposition />
      <SectionDivider type="angle" from="#FFFFFF" to="#F8F5F0" />
      <HowItWorks />
      <SectionDivider type="curve" from="#F8F5F0" to="#FFFFFF" />
      <AppCards />
      <SectionDivider type="wave" from="#FFFFFF" to="#F8F5F0" />
      <ComingSoonGrid />
      <SectionDivider type="angle" from="#F8F5F0" to="#FFFFFF" />
      <WhyPegrio />
      <AppsCTA />
      <AIGuideWidget />
    </>
  )
}
