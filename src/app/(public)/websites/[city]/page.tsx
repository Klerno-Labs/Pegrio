import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { getCityPage, getAllCitySlugs } from '@/data/cities'

export async function generateStaticParams() {
  return getAllCitySlugs().map(slug => ({ city: slug }))
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = getCityPage(params.city)
  if (!city) return {}
  return {
    title: `${city.headline} | Pegrio`,
    description: city.description,
    openGraph: {
      title: `${city.headline} | Pegrio`,
      description: city.description,
      url: `https://www.pegrio.com/websites/${city.slug}`,
    },
    alternates: {
      canonical: `https://www.pegrio.com/websites/${city.slug}`,
    },
  }
}

export default function CityPage({ params }: { params: { city: string } }) {
  const city = getCityPage(params.city)
  if (!city) notFound()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Pegrio LLC',
    description: `Website design for businesses in ${city.name}, ${city.state}`,
    url: `https://www.pegrio.com/websites/${city.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: city.state,
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'City',
      name: city.name,
    },
    priceRange: '$$',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Website Design Packages',
      itemListElement: [
        { '@type': 'Offer', name: 'Starter Website', price: '2000', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Growth Website', price: '5000', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Enterprise Website', price: '8000', priceCurrency: 'USD' },
      ],
    },
  }

  return (
    <>
      <Script
        id={`city-schema-${city.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero */}
      <section className="bg-navy text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(107,63,160,0.4) 0%, transparent 70%)' }}
          />
        </div>
        <div className="container text-center relative">
          <h1 className="text-white mb-4">{city.headline}</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            {city.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/order" className="btn-primary text-lg px-8 py-4 inline-block">
              Start Your Project — $2,000
            </Link>
            <Link href="/work" className="btn-secondary text-lg px-8 py-4 inline-block border-white text-white hover:bg-white hover:text-navy">
              See Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Pegrio */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-center mb-12">Why {city.name} Businesses Choose Pegrio</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {city.highlights.map((h, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-light/40 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {i === 0 && <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />}
                    {i === 0 && <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />}
                    {i === 1 && <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />}
                    {i === 2 && <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">{h.title}</h3>
                <p className="text-gray-muted text-sm">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Build */}
      <section className="py-16 bg-cream">
        <div className="container">
          <h2 className="text-center mb-4">Websites for Every {city.name} Business</h2>
          <p className="text-center text-gray-muted max-w-2xl mx-auto mb-12">
            From plumbers and HVAC companies to restaurants and med spas — we build custom websites for the industries that power {city.name}.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Home Services', desc: 'Plumbers, HVAC, roofers, electricians', icon: '🔧' },
              { title: 'Restaurants', desc: 'Menus, ordering, reservations', icon: '🍽️' },
              { title: 'Med Spas', desc: 'Booking, galleries, treatment pages', icon: '✨' },
              { title: 'Retail & Salons', desc: 'E-commerce, appointments, portfolios', icon: '🏪' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-gray-muted text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-white">
        <div className="container text-center">
          <h2 className="mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-muted max-w-xl mx-auto mb-8">
            Fixed pricing. No hourly rates. No surprises. 50% deposit to start.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Starter', price: '$2,000', pages: '5 pages', desc: 'Perfect for businesses that need a clean, professional online presence.' },
              { name: 'Growth', price: '$5,000', pages: 'Up to 10 pages', desc: 'For businesses ready to grow with full SEO, blog, and analytics.' },
              { name: 'Enterprise', price: '$8,000+', pages: 'Fully custom', desc: 'E-commerce, booking systems, and custom functionality.' },
            ].map((tier, i) => (
              <div key={i} className={`rounded-xl p-6 border ${i === 1 ? 'border-purple-accent bg-purple-light/10 ring-2 ring-purple-accent' : 'border-gray-200 bg-white'}`}>
                <h3 className="font-bold text-lg mb-1">{tier.name}</h3>
                <p className="text-3xl font-extrabold font-display mb-1">{tier.price}</p>
                <p className="text-sm text-gray-muted mb-3">{tier.pages}</p>
                <p className="text-sm text-gray-muted">{tier.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/order" className="btn-primary inline-block mt-8">
            Start Your Project
          </Link>
        </div>
      </section>

      {/* Areas Served */}
      <section className="py-16 bg-cream">
        <div className="container text-center">
          <h2 className="mb-4">Areas We Serve in {city.name}</h2>
          <p className="text-gray-muted max-w-xl mx-auto mb-8">
            We work with businesses across {city.name} and the surrounding communities.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {city.neighborhoods.map(n => (
              <span key={n} className="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm text-gray-text font-medium">
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy text-white py-20">
        <div className="container text-center">
          <h2 className="text-white mb-4">Ready to Stand Out in {city.name}?</h2>
          <p className="text-gray-300 max-w-xl mx-auto mb-8">
            Your competitors are already investing in their online presence. Let&apos;s make sure your website works harder than theirs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/order" className="btn-primary text-lg px-8 py-4 bg-white text-navy hover:bg-gray-100 inline-block">
              Start Your Project
            </Link>
            <Link href="/contact" className="text-white hover:text-gray-300 transition-colors font-semibold text-lg py-4 inline-block">
              Or send us a message →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
