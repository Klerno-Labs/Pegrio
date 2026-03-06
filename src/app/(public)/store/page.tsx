import type { Metadata } from 'next'
import Script from 'next/script'
import { getPublicShowcaseItems } from '@/lib/showcase-db'
import ShowcaseGrid from '@/components/showcase/ShowcaseGrid'

export const metadata: Metadata = {
  title: 'Pre-Built Websites & Apps for Sale | Pegrio Store',
  description:
    'Browse plug-and-play websites and apps built by Pegrio. Fully functional, professionally designed, ready to launch with your brand in days.',
  openGraph: {
    title: 'Pre-Built Websites & Apps for Sale | Pegrio Store',
    description:
      'Browse plug-and-play websites and apps built by Pegrio. Fully functional, professionally designed, ready to launch with your brand in days.',
    url: 'https://www.pegrio.com/store',
  },
  alternates: {
    canonical: 'https://www.pegrio.com/store',
  },
}

export const dynamic = 'force-dynamic'

export default async function StorePage() {
  let items: Awaited<ReturnType<typeof getPublicShowcaseItems>> = []
  try {
    items = await getPublicShowcaseItems()
  } catch {
    // showcase DB not reachable — show empty state gracefully
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Pegrio Store',
    description: 'Pre-built websites and apps ready for your business.',
    url: 'https://www.pegrio.com/store',
    provider: {
      '@type': 'Organization',
      name: 'Pegrio',
      url: 'https://www.pegrio.com',
    },
  }

  return (
    <>
      <Script
        id="store-schema-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero */}
      <section className="relative bg-navy pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 hero-gradient-mesh" />
        <div className="relative container text-center">
          <span className="inline-block mb-4 text-xs font-bold uppercase tracking-widest text-purple-accent bg-purple-accent/10 px-4 py-1.5 rounded-full">
            Ready to Launch
          </span>
          <h1 className="text-white mb-6 max-w-3xl mx-auto">
            Pre-Built Websites &amp; Apps
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Professionally designed, fully functional websites built by our team.
            Swap in your brand, add your content, and go live in days — not months.
            Every purchase includes a free setup guide.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Full source code
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Free setup guide included
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Deploy to Vercel in minutes
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <ShowcaseGrid items={items} />

      {/* CTA */}
      <section className="section bg-cream">
        <div className="container text-center max-w-2xl">
          <h2 className="mb-4">Need Something Custom?</h2>
          <p className="text-gray-muted mb-8 text-lg">
            Our pre-built sites are a great starting point. If you need a fully custom build
            or want us to set everything up for you, we offer a &ldquo;Done for You&rdquo; upgrade.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/order" className="btn-primary">
              Custom Website Build
            </a>
            <a href="/contact" className="btn-secondary">
              Ask About Done-for-You Setup
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
