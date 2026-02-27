'use client'

import Link from 'next/link'
import MotionReveal from '@/components/MotionReveal'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'

export default function FinalCTA() {
  return (
    <section className="bg-navy text-white py-20 relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(107,63,160,0.4) 0%, transparent 70%)' }}
        />
      </div>

      <div className="container text-center relative">
        <MotionReveal animation="scale-in">
          <h2 className="mb-4 text-white">Your Competitors Already Have Better Websites</h2>
          <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            Every week without a proper website is another week of lost customers.
            We can have your new site live in 3 weeks.
          </p>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            50% deposit to start. Fixed pricing. No surprises.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/order"
              className="btn-primary text-lg px-8 py-4 bg-white text-navy hover:bg-gray-100 inline-block"
              onClick={() => trackEvent(GA_EVENTS.CTA_CLICK, { location: 'final_cta', label: 'Start Your Project' })}
            >
              Start Your Project — $2,000
            </Link>
            <Link href="/contact" className="text-white hover:text-gray-300 transition-colors font-semibold text-lg py-4 inline-block">
              Or send us a message →
            </Link>
          </div>
        </MotionReveal>
      </div>
    </section>
  )
}
