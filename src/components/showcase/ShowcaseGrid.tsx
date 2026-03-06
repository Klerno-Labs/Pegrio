'use client'

import { useState } from 'react'
import type { ShowcaseItem } from '@/lib/showcase-db'
import ShowcaseCard from './ShowcaseCard'

const NICHE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'med_spa', label: 'Med Spa' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'home_services', label: 'Home Services' },
  { value: 'ecommerce', label: 'E-Commerce' },
  { value: 'saas', label: 'SaaS' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'agency', label: 'Agency' },
]

export default function ShowcaseGrid({ items }: { items: ShowcaseItem[] }) {
  const [activeNiche, setActiveNiche] = useState('all')

  const filtered =
    activeNiche === 'all' ? items : items.filter((i) => i.niche === activeNiche)

  // Only show filter tabs for niches that have items
  const availableNiches = new Set(items.map((i) => i.niche))
  const visibleFilters = NICHE_FILTERS.filter(
    (f) => f.value === 'all' || availableNiches.has(f.value)
  )

  return (
    <section className="section bg-white">
      <div className="container">
        {/* Filters */}
        {visibleFilters.length > 2 && (
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {visibleFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveNiche(f.value)}
                className={`
                  px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                  ${
                    activeNiche === f.value
                      ? 'bg-purple-accent text-white shadow-md'
                      : 'bg-cream text-gray-muted hover:bg-purple-light hover:text-purple-accent'
                  }
                `}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-navy mb-1">No websites available yet</p>
            <p className="text-gray-muted">Check back soon — new builds are added regularly.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, i) => (
              <ShowcaseCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
