'use client'

import MotionReveal from '@/components/MotionReveal'

export default function ResultsSection() {
  const results = [
    {
      metric: 'Page 1 on Google',
      detail: 'Within 60 days of launch for a Katy plumber',
      icon: '🎯',
    },
    {
      metric: '18-Day Delivery',
      detail: 'Full custom site built and live for a roofing company',
      icon: '⚡',
    },
    {
      metric: '90+ PageSpeed',
      detail: 'Every site we build hits this threshold — or we fix it',
      icon: '📊',
    },
    {
      metric: '12+ Projects Delivered',
      detail: 'Across home services, restaurants, med spas, and retail',
      icon: '✅',
    },
  ]

  return (
    <section className="section bg-navy text-white">
      <div className="container">
        <MotionReveal>
          <h2 className="text-center text-white mb-4">Real Results From Real Projects</h2>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            No testimonials yet — we&apos;re a new agency. But the results speak for themselves.
          </p>
        </MotionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((r, i) => (
            <MotionReveal key={r.metric} animation="fade-up" delay={i * 100}>
              <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors">
                <div className="text-4xl mb-3">{r.icon}</div>
                <div className="text-xl font-bold text-white mb-2 font-display">{r.metric}</div>
                <p className="text-gray-400 text-sm">{r.detail}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
