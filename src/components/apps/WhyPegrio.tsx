'use client'

import MotionReveal from '@/components/MotionReveal'
import { Code2, Shield, Zap } from 'lucide-react'

export default function WhyPegrio() {
  const differentiators = [
    {
      icon: Code2,
      title: 'Custom-Built, Not Template',
      description: 'Every app is built with modern tech (Next.js, React, Tailwind) — no WordPress plugins or drag-and-drop builders.',
    },
    {
      icon: Shield,
      title: 'You Own Everything',
      description: 'Your code, your data, your domain. No lock-in. No monthly hostage fees. You can take your app anywhere.',
    },
    {
      icon: Zap,
      title: 'Fast & Affordable',
      description: 'Industry templates mean we start from a solid foundation — cutting your cost and launch time significantly.',
    },
  ]

  return (
    <section className="section bg-white">
      <div className="container">
        <MotionReveal>
          <h2 className="text-center mb-16">Why Build With Pegrio</h2>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {differentiators.map((item, i) => (
            <MotionReveal key={item.title} animation="fade-up" delay={i * 100}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-green-trust mb-4">
                  <item.icon className="w-7 h-7 text-blue-accent" />
                </div>
                <h3 className="mb-3">{item.title}</h3>
                <p className="text-gray-muted">{item.description}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
