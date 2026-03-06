'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { ShowcaseItem } from '@/lib/showcase-db'

const NICHE_LABELS: Record<string, string> = {
  med_spa: 'Med Spa',
  restaurant: 'Restaurant',
  home_services: 'Home Services',
  ecommerce: 'E-Commerce',
  saas: 'SaaS',
  portfolio: 'Portfolio',
  agency: 'Agency',
  fitness: 'Fitness',
  real_estate: 'Real Estate',
  other: 'Other',
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export default function ShowcaseCard({ item, index }: { item: ShowcaseItem; index: number }) {
  const screenshots = item.screenshots ?? []
  const features = item.features ?? []
  const techStack = item.techStack ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link href={`/store/${item.id}`} className="block group">
        <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group-hover:-translate-y-1">
          {/* Preview Image */}
          {screenshots.length > 0 ? (
            <div className="relative h-52 overflow-hidden">
              <img
                src={screenshots[0]}
                alt={`${item.name} preview`}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {item.liveUrl && (
                <div className="absolute bottom-3 left-3 right-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-white/95 backdrop-blur-sm text-navy font-semibold text-sm px-4 py-2 rounded-lg shadow-lg">
                    View Details
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="h-52 bg-cream flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-accent/10 flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-purple-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </div>
                <span className="text-sm text-gray-muted">Preview coming soon</span>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-navy leading-tight">{item.name}</h3>
                <span className="inline-block mt-1 text-xs font-semibold text-purple-accent bg-purple-accent/10 px-2.5 py-0.5 rounded-full">
                  {NICHE_LABELS[item.niche] ?? item.niche}
                </span>
              </div>
              {item.price && (
                <p className="text-xl font-extrabold text-navy whitespace-nowrap font-display">
                  {formatPrice(item.price)}
                </p>
              )}
            </div>

            {item.description && (
              <p className="text-sm text-gray-muted line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}

            {/* Tech Stack */}
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {techStack.slice(0, 5).map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-medium text-gray-muted bg-cream px-2 py-0.5 rounded-md"
                  >
                    {t}
                  </span>
                ))}
                {techStack.length > 5 && (
                  <span className="text-[11px] text-gray-muted">+{techStack.length - 5}</span>
                )}
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {features.slice(0, 3).map((f) => (
                  <span
                    key={f}
                    className="text-[11px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-md"
                  >
                    {f}
                  </span>
                ))}
                {features.length > 3 && (
                  <span className="text-[11px] text-gray-muted">+{features.length - 3} more</span>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="pt-2 border-t border-gray-100">
              <span className="text-sm font-semibold text-purple-accent group-hover:underline">
                View Details &rarr;
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
