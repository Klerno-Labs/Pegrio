'use client'

import { motion } from 'framer-motion'

interface TierSelectorProps {
  selectedTier: number | null
  onSelect: (tier: number) => void
}

const tiers = [
  {
    id: 1,
    name: 'STARTER',
    price: 2000,
    priceDisplay: '$2,000',
    subtitle: 'one-time',
    description: 'Perfect for small businesses getting online',
    features: [
      '5-page website (Home, About, Services, Contact, Blog)',
      'Mobile-responsive design',
      'Basic on-page SEO (meta tags, schema markup, XML sitemap)',
      'Contact form + Google Maps integration',
      'Speed optimization (90+ PageSpeed target)',
      '30-day post-launch support',
    ],
  },
  {
    id: 2,
    name: 'GROWTH',
    price: 5000,
    priceDisplay: '$5,000',
    subtitle: 'one-time',
    description: 'For businesses ready to scale their online presence',
    featured: true,
    features: [
      'Up to 10 pages with fully custom design (no templates)',
      'Full on-page SEO + schema markup + robots.txt',
      'Blog / CMS system (client can update content themselves)',
      'Google Analytics 4 + heatmap setup',
      'Conversion-optimized landing pages',
      'Social media integration',
      '60-day post-launch support with weekly check-ins',
    ],
  },
  {
    id: 3,
    name: 'ENTERPRISE',
    price: 8000,
    priceDisplay: '$8,000+',
    subtitle: 'starting at',
    description: 'Full custom build with advanced integrations',
    features: [
      'Full custom build — no templates, no shortcuts',
      'E-commerce or booking/CRM integration',
      '2-hour strategy session before any design work',
      'Performance guarantee — we fix it if it doesn\'t generate results',
      'Priority turnaround and dedicated support',
      'Custom API integrations',
      'Advanced analytics & reporting dashboard',
      '90-day post-launch support',
    ],
  },
]

export { tiers }

export default function TierSelector({ selectedTier, onSelect }: TierSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tiers.map((tier, i) => {
        const isSelected = selectedTier === tier.id

        return (
          <motion.button
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            onClick={() => onSelect(tier.id)}
            className={`
              relative text-left rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer
              ${isSelected
                ? 'border-purple-accent bg-purple-accent/10 shadow-[0_0_30px_rgba(107,63,160,0.3)]'
                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'
              }
            `}
          >
            {tier.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-accent text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider">
                MOST POPULAR
              </div>
            )}

            {isSelected && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-purple-accent flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            <div className="mb-4">
              <p className="text-xs font-bold tracking-[0.2em] text-purple-accent/80 mb-1">
                {tier.name}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white font-display">
                  {tier.priceDisplay}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{tier.subtitle}</p>
            </div>

            <p className="text-sm text-gray-300 mb-4">{tier.description}</p>

            <ul className="space-y-2.5">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <span className="text-purple-accent mt-0.5 flex-shrink-0 text-sm">&#10003;</span>
                  <span className="text-sm text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <div className={`
              mt-6 w-full py-3 rounded-xl text-center text-sm font-semibold transition-all
              ${isSelected
                ? 'bg-purple-accent text-white'
                : 'bg-white/10 text-white/70'
              }
            `}>
              {isSelected ? 'Selected' : 'Select Plan'}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
