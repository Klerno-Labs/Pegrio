'use client'

import Link from 'next/link'
import MotionReveal from '@/components/MotionReveal'
import { Smartphone } from 'lucide-react'

export default function PricingPreview() {
  const tiers = [
    {
      name: 'STARTER',
      price: '$2,000',
      tagline: 'one-time',
      features: [
        '5-page website (Home, About, Services, Contact, Blog)',
        'Mobile-responsive design',
        'Basic on-page SEO (meta tags, schema markup, XML sitemap)',
        'Contact form + Google Maps integration',
        'Speed optimization (90+ PageSpeed target)',
        '30-day post-launch support',
      ],
      cta: 'Get Started',
      href: '/order?tier=1',
      featured: false,
    },
    {
      name: 'GROWTH',
      price: '$5,000',
      tagline: 'one-time',
      features: [
        'Up to 10 pages with fully custom design (no templates)',
        'Full on-page SEO + schema markup + robots.txt',
        'Blog / CMS system (client can update content themselves)',
        'Google Analytics 4 + heatmap setup',
        '60-day post-launch support with weekly check-ins',
      ],
      cta: 'Get Started',
      href: '/order?tier=2',
      featured: true,
    },
    {
      name: 'ENTERPRISE',
      price: '$8,000+',
      tagline: 'starting at',
      features: [
        'Full custom build — no templates, no shortcuts',
        'E-commerce or booking/CRM integration',
        '2-hour strategy session included before any design work',
        "Performance guarantee — we fix it if it doesn't generate results",
        'Priority turnaround and dedicated support',
      ],
      cta: 'Get Started',
      href: '/order?tier=3',
      featured: false,
    },
  ]

  return (
    <section className="section bg-white bg-grid" id="pricing-preview">
      <div className="container">
        <MotionReveal>
          <h2 className="text-center mb-4">Straightforward Pricing. No Surprises.</h2>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {tiers.map((tier, i) => (
            <MotionReveal key={tier.name} animation="fade-up" delay={i * 100}>
              <div
                className={`card relative h-full flex flex-col ${tier.featured ? 'ring-2 ring-blue-accent' : ''}`}
              >
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-accent text-white px-4 py-1 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="mb-2">{tier.name}</h3>
                  <div className="text-4xl font-bold text-navy mb-1">{tier.price}</div>
                  <div className="text-sm text-gray-muted">{tier.tagline}</div>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-accent mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.href}
                  className={tier.featured ? 'btn-primary w-full block text-center' : 'btn-secondary w-full block text-center'}
                >
                  {tier.cta}
                </Link>
              </div>
            </MotionReveal>
          ))}
        </div>

        {/* Industry Apps Card */}
        <MotionReveal animation="fade-up" delay={400}>
          <div className="mt-8">
            <Link href="/apps" className="block">
              <div className="card border-2 border-gold-premium/30 bg-gradient-to-r from-gold-light/50 to-white hover:border-gold-premium/60 transition-colors">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-premium/10">
                      <Smartphone className="w-8 h-8 text-gold-premium" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                      <h3 className="text-xl font-bold text-navy">Industry Apps</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gold-premium text-white">
                        New
                      </span>
                    </div>
                    <p className="text-gray-muted">
                      Custom web apps built for your industry — hemp retail, med spas, restaurants, and more. Launched in days, not months.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-gold-premium font-semibold">Explore Apps →</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </MotionReveal>

        <MotionReveal animation="fade-in" delay={500}>
          <div className="text-center mt-8">
            <p className="text-gray-muted mb-4">
              Not sure which is right for you?{' '}
              <Link href="/order" className="text-blue-accent link-underline font-semibold">
                Start your project and we&apos;ll help you decide.
              </Link>
            </p>
          </div>
        </MotionReveal>
      </div>
    </section>
  )
}
