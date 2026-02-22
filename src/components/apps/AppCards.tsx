'use client'

import MotionReveal from '@/components/MotionReveal'
import { featuredApp } from '@/data/apps'
import { ExternalLink, Check } from 'lucide-react'

export default function AppCards() {
  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/c-hatfield309/30min'
      })
    }
  }

  const app = featuredApp

  return (
    <section className="section bg-white bg-grid" id="app-cards">
      <div className="container">
        <MotionReveal>
          <h2 className="text-center mb-4">Available Now</h2>
          <p className="text-center text-gray-muted mb-12 max-w-2xl mx-auto">
            Production-ready apps you can launch for your business today
          </p>
        </MotionReveal>

        <MotionReveal animation="fade-up" delay={100}>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Dark left panel */}
              <div className="bg-navy text-white p-8 lg:p-12">
                <div className="inline-flex items-center gap-2 bg-gold-premium/20 border border-gold-premium/30 rounded-full px-3 py-1 mb-6">
                  <span className="w-2 h-2 rounded-full bg-gold-premium" />
                  <span className="text-gold-premium text-sm font-medium">{app.industry}</span>
                </div>

                <h3 className="text-3xl font-bold font-display mb-3">{app.name}</h3>
                <p className="text-gray-300 leading-relaxed mb-8">{app.description}</p>

                <div className="mb-8">
                  <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">{app.priceLabel}</div>
                  <div className="text-3xl font-bold font-mono text-gold-premium">{app.price}</div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={app.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary border-white/30 text-white hover:bg-white hover:text-navy flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Live Demo
                  </a>
                  <button onClick={openCalendly} className="btn-primary bg-gold-premium hover:bg-gold-premium/90">
                    Get This App
                  </button>
                </div>
              </div>

              {/* White right panel — features */}
              <div className="bg-white p-8 lg:p-12">
                <h4 className="font-bold text-lg mb-6 text-navy">What&apos;s Included</h4>
                <div className="space-y-5">
                  {app.features.map((feature) => (
                    <div key={feature.title} className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-6 h-6 rounded-full bg-blue-accent/10 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-blue-accent" />
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-text">{feature.title}</div>
                        <div className="text-sm text-gray-muted">{feature.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  )
}
