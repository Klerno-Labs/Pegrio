'use client'

import MotionReveal from '@/components/MotionReveal'
import { BadgeDollarSign, FileCheck, Server } from 'lucide-react'

export default function TrustSection() {
  const trustPoints = [
    {
      icon: BadgeDollarSign,
      title: '50% to start. 50% on launch.',
      description: "You don't pay the second half until you're happy with the result",
    },
    {
      icon: FileCheck,
      title: 'Fixed scope. No surprise invoices.',
      description: 'Every project has a signed agreement with clear deliverables and revision rounds',
    },
    {
      icon: Server,
      title: 'We host everything.',
      description: 'All sites live on our managed servers. No maintenance headaches, no technical stress for you.',
    },
  ]

  return (
    <section className="section bg-white">
      <div className="container">
        <MotionReveal>
          <h2 className="text-center mb-16">How We Keep It Simple and Safe for You</h2>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustPoints.map((point, i) => (
            <MotionReveal key={point.title} animation="fade-up" delay={i * 100}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-green-trust mb-4">
                  <point.icon className="w-7 h-7 text-blue-accent" />
                </div>
                <h3 className="mb-3">{point.title}</h3>
                <p className="text-gray-muted">{point.description}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
