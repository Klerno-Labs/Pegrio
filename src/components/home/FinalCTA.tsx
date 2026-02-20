'use client'

import ScrollReveal from '@/components/ScrollReveal'

export default function FinalCTA() {
  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/c-hatfield309/30min'
      })
    }
  }

  return (
    <section className="bg-navy text-white py-20 relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(107,63,160,0.4) 0%, transparent 70%)' }}
        />
      </div>

      <div className="container text-center relative">
        <ScrollReveal animation="scale-in">
          <h2 className="mb-4">Find Out What Your Website Is Costing You</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Free 15-minute audit. No pitch. Just honest feedback.
          </p>

          <button onClick={openCalendly} className="btn-primary text-lg px-8 py-4 bg-white text-navy hover:bg-gray-100">
            Book My Free Audit
          </button>
        </ScrollReveal>
      </div>
    </section>
  )
}
