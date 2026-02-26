'use client'

import { motion } from 'framer-motion'

export interface MaintenancePlan {
  id: string
  name: string
  price: number
  priceDisplay: string
  period: string
  features: string[]
}

interface MaintenanceSelectorProps {
  selectedPlan: string | null
  onSelect: (planId: string) => void
}

const maintenancePlans: MaintenancePlan[] = [
  {
    id: 'none',
    name: 'No Maintenance',
    price: 0,
    priceDisplay: '$0',
    period: '',
    features: [
      'Self-managed updates',
      'No ongoing support',
      'You handle hosting & security',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 97,
    priceDisplay: '$97',
    period: '/mo',
    features: [
      'Monthly security updates',
      'Uptime monitoring',
      'Monthly performance report',
      'Email support (48hr response)',
      '1 content update per month',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 197,
    priceDisplay: '$197',
    period: '/mo',
    features: [
      'Everything in Basic',
      'Weekly backups',
      'Priority email support (24hr)',
      '4 content updates per month',
      'Monthly SEO report',
      'Plugin/dependency updates',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 497,
    priceDisplay: '$497',
    period: '/mo',
    features: [
      'Everything in Standard',
      'Daily backups',
      'Phone + Slack support (same day)',
      'Unlimited content updates',
      'Monthly strategy call',
      'A/B testing & optimization',
      'Priority bug fixes',
      'Quarterly redesign refresh',
    ],
  },
]

export { maintenancePlans }

export default function MaintenanceSelector({ selectedPlan, onSelect }: MaintenanceSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {maintenancePlans.map((plan, i) => {
        const isSelected = selectedPlan === plan.id

        return (
          <motion.button
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            onClick={() => onSelect(plan.id)}
            className={`
              relative text-left rounded-2xl p-5 border-2 transition-all duration-300 cursor-pointer
              ${isSelected
                ? 'border-purple-accent bg-purple-accent/10 shadow-[0_0_24px_rgba(107,63,160,0.25)]'
                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'
              }
            `}
          >
            {isSelected && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-purple-accent flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            <div className="mb-3">
              <p className="text-sm font-bold text-white mb-1">{plan.name}</p>
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-bold text-white font-display">
                  {plan.priceDisplay}
                </span>
                {plan.period && (
                  <span className="text-sm text-gray-400">{plan.period}</span>
                )}
              </div>
            </div>

            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="text-purple-accent mt-0.5 flex-shrink-0 text-xs">&#10003;</span>
                  <span className="text-xs text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <div className={`
              mt-4 w-full py-2.5 rounded-xl text-center text-xs font-semibold transition-all
              ${isSelected
                ? 'bg-purple-accent text-white'
                : 'bg-white/10 text-white/70'
              }
            `}>
              {isSelected ? 'Selected' : plan.id === 'none' ? 'Skip' : 'Select'}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
