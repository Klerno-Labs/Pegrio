'use client'

import { motion } from 'framer-motion'

export interface AddOn {
  id: string
  name: string
  price: number
  priceDisplay: string
  description: string
  hasQuantity?: boolean
  quantity?: number
}

interface AddOnSelectorProps {
  selectedAddOns: AddOn[]
  onToggle: (addOn: AddOn) => void
  onQuantityChange?: (addOnId: string, quantity: number) => void
}

const availableAddOns: Omit<AddOn, 'quantity'>[] = [
  {
    id: 'blog-cms',
    name: 'Blog / CMS Setup',
    price: 500,
    priceDisplay: '$500',
    description: 'Full blog system with content management, categories, and SEO-optimized templates.',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Integration',
    price: 1500,
    priceDisplay: '$1,500',
    description: 'Product catalog, shopping cart, Stripe checkout, and order management.',
  },
  {
    id: 'booking',
    name: 'Booking System',
    price: 750,
    priceDisplay: '$750',
    description: 'Online scheduling with calendar sync, automated reminders, and payment collection.',
  },
  {
    id: 'contact-form',
    name: 'Custom Contact Form',
    price: 250,
    priceDisplay: '$250',
    description: 'Advanced multi-step contact form with file uploads, conditional fields, and CRM integration.',
  },
  {
    id: 'seo-audit',
    name: 'SEO Audit & Setup',
    price: 500,
    priceDisplay: '$500',
    description: 'Comprehensive SEO audit, keyword research, meta optimization, and Google Search Console setup.',
  },
  {
    id: 'google-business',
    name: 'Google Business Setup',
    price: 300,
    priceDisplay: '$300',
    description: 'Google Business Profile creation/optimization with photos, hours, and review management.',
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    price: 400,
    priceDisplay: '$400',
    description: 'Custom analytics dashboard with GA4, heatmaps, conversion tracking, and monthly reports.',
  },
  {
    id: 'extra-pages',
    name: 'Extra Pages',
    price: 300,
    priceDisplay: '$300',
    description: 'Additional custom-designed pages beyond your plan\'s included pages.',
    hasQuantity: true,
  },
]

export { availableAddOns }

export default function AddOnSelector({ selectedAddOns, onToggle, onQuantityChange }: AddOnSelectorProps) {
  const isSelected = (id: string) => selectedAddOns.some(a => a.id === id)
  const getQuantity = (id: string) => selectedAddOns.find(a => a.id === id)?.quantity || 1

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {availableAddOns.map((addOn, i) => {
        const selected = isSelected(addOn.id)

        return (
          <motion.div
            key={addOn.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
            className={`
              relative rounded-2xl p-5 border-2 transition-all duration-300
              ${selected
                ? 'border-purple-accent bg-purple-accent/10'
                : 'border-white/10 bg-white/5 hover:border-white/20'
              }
            `}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <button
                    onClick={() => onToggle({ ...addOn, quantity: addOn.hasQuantity ? 1 : undefined })}
                    className={`
                      w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all
                      ${selected
                        ? 'bg-purple-accent border-purple-accent'
                        : 'border-white/30 hover:border-white/50'
                      }
                    `}
                  >
                    {selected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <h4
                    className="text-sm font-semibold text-white cursor-pointer"
                    onClick={() => onToggle({ ...addOn, quantity: addOn.hasQuantity ? 1 : undefined })}
                  >
                    {addOn.name}
                  </h4>
                </div>
                <p className="text-xs text-gray-400 ml-8">{addOn.description}</p>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-lg font-bold text-white">{addOn.priceDisplay}</span>
                {addOn.hasQuantity && <span className="text-xs text-gray-400 block">each</span>}
              </div>
            </div>

            {/* Quantity selector for "Extra Pages" */}
            {addOn.hasQuantity && selected && onQuantityChange && (
              <div className="mt-3 ml-8 flex items-center gap-3">
                <span className="text-xs text-gray-400">Quantity:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      const q = getQuantity(addOn.id)
                      if (q > 1) onQuantityChange(addOn.id, q - 1)
                    }}
                    className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-white">
                    {getQuantity(addOn.id)}
                  </span>
                  <button
                    onClick={() => {
                      const q = getQuantity(addOn.id)
                      if (q < 20) onQuantityChange(addOn.id, q + 1)
                    }}
                    className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors text-sm"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-400">
                  = ${(addOn.price * getQuantity(addOn.id)).toLocaleString()}
                </span>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
