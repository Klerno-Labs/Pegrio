'use client'

import BuildSystem from './BuildSystem'

export default function AboutContent() {
  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/c-hatfield309/30min'
      })
    }
  }

  return (
    <>
      {/* Page Header */}
      <section className="section bg-white pt-32">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h1 className="mb-8">Built by a Developer Who Gets Local Business</h1>

            <div className="prose prose-lg max-w-none text-gray-text space-y-6">
              <p>
                I'm Chris, the founder of Pegrio. I started this company because I kept seeing the same problem: local businesses with real expertise, loyal customers, and strong reputations — but websites that made them look like amateurs.
              </p>

              <p>
                Most small business owners don't have time to become web developers. They need someone they can trust to handle it right the first time and keep it running without drama.
              </p>

              <p>
                That's what Pegrio does. We work with home service businesses, med spas, restaurants, and local companies across Houston, Katy, and the entire US. Every project is scoped clearly, priced fairly, delivered on time, and built to generate real results — not just look good.
              </p>

              <p className="font-semibold text-navy text-xl">
                If your website isn't generating leads, it's costing you money every single day. Let's fix that.
              </p>
            </div>
          </div>
        </div>
      </section>

      <BuildSystem />

      {/* Bottom CTA */}
      <section className="section bg-gray-bg">
        <div className="container text-center">
          <h2 className="mb-6">Work With Us</h2>
          <p className="text-xl text-gray-muted mb-8 max-w-2xl mx-auto">
            Ready to turn your website into a lead generation machine?
          </p>
          <button
            onClick={openCalendly}
            className="btn-primary text-lg px-8 py-4"
          >
            Book Your Free Audit
          </button>
        </div>
      </section>
    </>
  )
}
