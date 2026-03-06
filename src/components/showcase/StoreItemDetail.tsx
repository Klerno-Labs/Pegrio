'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { ShowcaseItem } from '@/lib/showcase-db'
import PreviewModal from './PreviewModal'
import ShowcaseCard from './ShowcaseCard'

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

interface Props {
  item: ShowcaseItem
  relatedItems: ShowcaseItem[]
}

export default function StoreItemDetail({ item, relatedItems }: Props) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [activeScreenshot, setActiveScreenshot] = useState(0)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const screenshots = item.screenshots ?? []
  const features = item.features ?? []
  const techStack = item.techStack ?? []

  async function handlePurchase() {
    setIsCheckingOut(true)
    try {
      const res = await fetch('/api/showcase-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showcaseId: item.id,
          name: item.name,
          price: item.price,
          niche: item.niche,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.message || 'Failed to create checkout session')
      }
    } catch {
      setIsCheckingOut(false)
    }
  }

  return (
    <>
      <div className="bg-white min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-cream pt-24 pb-4">
          <div className="container">
            <nav className="flex items-center gap-2 text-sm text-gray-muted">
              <Link href="/store" className="hover:text-purple-accent transition-colors">
                Store
              </Link>
              <span>/</span>
              <span className="text-navy font-medium">{item.name}</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <section className="section bg-white">
          <div className="container">
            <div className="grid lg:grid-cols-5 gap-10">
              {/* Left: Screenshots */}
              <div className="lg:col-span-3 space-y-4">
                {/* Main Image */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative rounded-2xl overflow-hidden bg-cream aspect-[16/10] group cursor-pointer"
                  onClick={() => item.liveUrl && setPreviewOpen(true)}
                >
                  {screenshots.length > 0 ? (
                    <>
                      <img
                        src={screenshots[activeScreenshot]}
                        alt={`${item.name} screenshot ${activeScreenshot + 1}`}
                        className="w-full h-full object-cover object-top"
                      />
                      {item.liveUrl && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-navy font-bold px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Interactive Preview
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-muted">No preview available</p>
                    </div>
                  )}
                </motion.div>

                {/* Thumbnail Strip */}
                {screenshots.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {screenshots.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveScreenshot(i)}
                        className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                          activeScreenshot === i
                            ? 'border-purple-accent shadow-md'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Thumbnail ${i + 1}`}
                          className="w-full h-full object-cover object-top"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Live Preview Button */}
                {item.liveUrl && (
                  <button
                    onClick={() => setPreviewOpen(true)}
                    className="w-full py-3 rounded-xl border-2 border-purple-accent text-purple-accent font-semibold hover:bg-purple-accent hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Open Interactive Preview
                  </button>
                )}
              </div>

              {/* Right: Details + Purchase */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-purple-accent bg-purple-accent/10 px-3 py-1 rounded-full mb-3">
                    {NICHE_LABELS[item.niche] ?? item.niche}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-navy font-display leading-tight">
                    {item.name}
                  </h1>
                </div>

                {item.price && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-navy font-display">
                      {formatPrice(item.price)}
                    </span>
                    <span className="text-sm text-gray-muted">one-time</span>
                  </div>
                )}

                {item.description && (
                  <p className="text-gray-muted leading-relaxed">{item.description}</p>
                )}

                {/* Purchase Button */}
                {item.price && (
                  <button
                    onClick={handlePurchase}
                    disabled={isCheckingOut}
                    className={`
                      w-full py-4 rounded-xl text-lg font-bold transition-all duration-300
                      ${isCheckingOut
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-accent text-white hover:bg-purple-accent/90 shadow-lg hover:shadow-xl cursor-pointer'
                      }
                    `}
                  >
                    {isCheckingOut ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Redirecting to Checkout...
                      </span>
                    ) : (
                      `Buy Now — ${formatPrice(item.price)}`
                    )}
                  </button>
                )}

                {/* What's Included */}
                <div className="bg-cream rounded-2xl p-5 space-y-3">
                  <h3 className="text-base font-bold text-navy">What&apos;s Included</h3>
                  <ul className="space-y-2">
                    {[
                      'Full source code (GitHub repo access)',
                      'Free step-by-step setup guide',
                      'Responsive design (mobile + desktop)',
                      'Production-ready, deployed on Vercel',
                      'SEO optimized out of the box',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-text">
                        <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                {techStack.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-navy mb-2">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {techStack.map((t) => (
                        <span
                          key={t}
                          className="text-xs font-medium text-gray-muted bg-cream px-3 py-1.5 rounded-lg"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                {features.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-navy mb-2">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {features.map((f) => (
                        <span
                          key={f}
                          className="text-xs font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-lg"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Done for You upsell */}
                <div className="border-2 border-dashed border-purple-accent/30 rounded-2xl p-5 bg-purple-accent/5">
                  <h4 className="text-sm font-bold text-navy mb-1">Want us to set it up for you?</h4>
                  <p className="text-sm text-gray-muted mb-3">
                    We&apos;ll customize the branding, add your content, connect your domain, and launch it — so you don&apos;t have to touch code.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-purple-accent hover:underline"
                  >
                    Get a Done-for-You quote
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <section className="section bg-cream">
            <div className="container">
              <h2 className="text-center mb-10">More in {NICHE_LABELS[item.niche] ?? item.niche}</h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {relatedItems.map((related, i) => (
                  <ShowcaseCard key={related.id} item={related} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Preview Modal */}
      {item.liveUrl && (
        <PreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          url={item.liveUrl}
          title={item.name}
        />
      )}
    </>
  )
}
