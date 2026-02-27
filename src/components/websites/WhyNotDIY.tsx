'use client'

import MotionReveal from '@/components/MotionReveal'

export default function WhyNotDIY() {
  const comparisons = [
    { feature: 'Custom design (no templates)', pegrio: true, diy: false },
    { feature: 'SEO optimized from day one', pegrio: true, diy: false },
    { feature: '90+ Google PageSpeed score', pegrio: true, diy: false },
    { feature: 'Someone else handles the tech', pegrio: true, diy: false },
    { feature: 'Built in 3 weeks, not 3 months', pegrio: true, diy: false },
    { feature: 'Ongoing support & maintenance', pegrio: true, diy: false },
    { feature: 'Costs under $100/month', pegrio: false, diy: true },
  ]

  return (
    <section className="section bg-gray-bg">
      <div className="container max-w-3xl">
        <MotionReveal>
          <h2 className="text-center mb-4">Why Not Just Use Wix or Squarespace?</h2>
          <p className="text-center text-gray-muted mb-12">
            You can. But here&apos;s what you&apos;re giving up.
          </p>
        </MotionReveal>

        <MotionReveal animation="fade-up" delay={200}>
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-navy text-white text-sm font-semibold text-center">
              <div className="p-4 text-left">Feature</div>
              <div className="p-4">Pegrio</div>
              <div className="p-4">DIY Builder</div>
            </div>

            {/* Rows */}
            {comparisons.map((row) => (
              <div key={row.feature} className="grid grid-cols-3 border-t border-gray-100 text-center items-center">
                <div className="p-4 text-left text-sm text-gray-text">{row.feature}</div>
                <div className="p-4">
                  {row.pegrio
                    ? <span className="text-green-600 font-bold text-lg">&#10003;</span>
                    : <span className="text-gray-300">—</span>}
                </div>
                <div className="p-4">
                  {row.diy
                    ? <span className="text-green-600 font-bold text-lg">&#10003;</span>
                    : <span className="text-red-400 font-bold text-lg">&#10007;</span>}
                </div>
              </div>
            ))}
          </div>
        </MotionReveal>

        <MotionReveal animation="fade-up" delay={400}>
          <p className="text-center text-gray-muted mt-8 text-sm">
            The last row is honest — DIY is cheaper upfront. But if your business depends on being found online, the investment pays for itself.
          </p>
        </MotionReveal>
      </div>
    </section>
  )
}
