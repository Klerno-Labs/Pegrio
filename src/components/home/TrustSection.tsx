'use client'

import ScrollReveal from '@/components/ScrollReveal'

export default function TrustSection() {
  const trustPoints = [
    {
      icon: '💰',
      title: '50% to start. 50% on launch.',
      description: "You don't pay the second half until you're happy with the result",
    },
    {
      icon: '📝',
      title: 'Fixed scope. No surprise invoices.',
      description: 'Every project has a signed agreement with clear deliverables and revision rounds',
    },
    {
      icon: '🖥️',
      title: 'We host everything.',
      description: 'All sites live on our managed servers. No maintenance headaches, no technical stress for you.',
    },
  ]

  return (
    <section className="section bg-white">
      <div className="container">
        <ScrollReveal>
          <h2 className="text-center mb-16">How We Keep It Simple and Safe for You</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustPoints.map((point, i) => (
            <ScrollReveal key={point.title} animation="fade-up" delay={i * 100}>
              <div className="text-center">
                <div className="text-5xl mb-4">{point.icon}</div>
                <h3 className="mb-3">{point.title}</h3>
                <p className="text-gray-muted">{point.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
