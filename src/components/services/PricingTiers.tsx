'use client'

export default function PricingTiers() {
  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/c-hatfield309/30min'
      })
    }
  }

  const tiers = [
    {
      name: 'STARTER',
      price: '$2,000',
      subtitle: 'one-time',
      features: [
        '5-page website (Home, About, Services, Contact, Blog)',
        'Mobile-responsive design',
        'Basic on-page SEO (meta tags, schema markup, XML sitemap)',
        'Contact form + Google Maps integration',
        'Speed optimization (90+ PageSpeed target)',
        '30-day post-launch support',
      ],
      cta: 'Get Started',
      featured: false,
    },
    {
      name: 'GROWTH',
      price: '$5,000',
      subtitle: 'one-time',
      features: [
        'Up to 10 pages with fully custom design (no templates)',
        'Full on-page SEO + schema markup + robots.txt',
        'Blog / CMS system (client can update content themselves)',
        'Google Analytics 4 + heatmap setup',
        '60-day post-launch support with weekly check-ins',
      ],
      cta: 'Get Started',
      featured: true,
    },
    {
      name: 'ENTERPRISE',
      price: '$8,000+',
      subtitle: 'starting at',
      features: [
        'Full custom build — no templates, no shortcuts',
        'E-commerce or booking/CRM integration',
        '2-hour strategy session included before any design work',
        "Performance guarantee — we fix it if it doesn't generate results",
        'Priority turnaround and dedicated support',
      ],
      cta: "Let's Talk",
      featured: false,
    },
  ]

  return (
    <section className="section bg-gray-bg">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`card relative ${tier.featured ? 'ring-2 ring-blue-accent transform md:-translate-y-4' : ''}`}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-accent text-white px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap">
                  MOST POPULAR
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">{tier.name}</h2>
                <div className="text-5xl font-bold text-navy mb-2">{tier.price}</div>
                <div className="text-sm text-gray-muted">{tier.subtitle}</div>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="text-blue-accent text-xl mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-gray-text">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={openCalendly}
                className={tier.featured ? 'btn-primary w-full text-lg' : 'btn-secondary w-full text-lg'}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
