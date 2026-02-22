import type { Metadata } from 'next'
import PricingTiers from '@/components/websites/PricingTiers'
import MaintenancePlans from '@/components/websites/MaintenancePlans'

export const metadata: Metadata = {
  title: 'Website Design Packages & Pricing | Pegrio',
  description: 'Fixed-price website packages for local businesses. Starter from $2,000, Growth at $5,000, Enterprise from $8,000. Monthly maintenance plans from $97/month.',
  openGraph: {
    title: 'Website Design Packages & Pricing | Pegrio',
    description: 'Fixed-price website packages for local businesses. Starter from $2,000, Growth at $5,000, Enterprise from $8,000.',
    url: 'https://www.pegrio.com/websites',
  },
  alternates: {
    canonical: 'https://www.pegrio.com/websites',
  },
}

export default function WebsitesPage() {
  return (
    <>
      {/* Page Header */}
      <section className="section bg-white pt-32">
        <div className="container text-center">
          <h1 className="mb-6">Website Packages Built for Local Business Growth</h1>
          <p className="text-xl text-gray-muted max-w-3xl mx-auto">
            Serving Houston, Katy, and businesses across the US. Fixed pricing. No hourly rates. No surprises.
          </p>
        </div>
      </section>

      <PricingTiers />
      <MaintenancePlans />
    </>
  )
}
