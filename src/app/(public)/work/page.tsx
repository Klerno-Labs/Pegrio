import type { Metadata } from 'next'
import PortfolioGrid from '@/components/work/PortfolioGrid'

export const metadata: Metadata = {
  title: 'Portfolio — Websites We\'ve Built | Pegrio',
  description: 'See websites Pegrio has built for plumbers, HVAC companies, roofers, med spas, and restaurants in Houston and nationwide.',
  openGraph: {
    title: 'Portfolio — Websites We\'ve Built | Pegrio',
    description: 'See websites Pegrio has built for plumbers, HVAC companies, roofers, med spas, and restaurants in Houston and nationwide.',
    url: 'https://www.pegrio.com/work',
  },
  alternates: {
    canonical: 'https://www.pegrio.com/work',
  },
}

export default function WorkPage() {
  return (
    <>
      {/* Page Header */}
      <section className="section bg-white pt-32">
        <div className="container text-center">
          <h1 className="mb-6">Our Work</h1>
          <p className="text-xl text-gray-muted max-w-2xl mx-auto">
            Every site built for one goal: more leads for your business.
          </p>
        </div>
      </section>

      <PortfolioGrid />
    </>
  )
}
