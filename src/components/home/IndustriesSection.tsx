'use client'

import MotionReveal from '@/components/MotionReveal'
import { Wrench, Sparkles, UtensilsCrossed } from 'lucide-react'

export default function IndustriesSection() {
  const industries = [
    {
      icon: Wrench,
      title: 'Home Services',
      description: 'Plumbers, HVAC techs, and roofers — when someone searches for you, you need to show up and convert immediately',
    },
    {
      icon: Sparkles,
      title: 'Med Spas & Aesthetics',
      description: 'High-end clients expect a high-end website. We build for trust, bookings, and brand credibility.',
    },
    {
      icon: UtensilsCrossed,
      title: 'Restaurants & Food',
      description: 'Menus, reservations, hours, and reviews — all working perfectly on every device, every time',
    },
  ]

  return (
    <section className="section bg-white bg-dots">
      <div className="container">
        <MotionReveal>
          <h2 className="text-center mb-4">
            Built for Businesses That Can&apos;t Afford a Website That Doesn&apos;t Work
          </h2>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {industries.map((industry, i) => (
            <MotionReveal key={industry.title} animation="fade-up" delay={i * 100}>
              <div className="card text-center h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-accent/10 mb-4">
                  <industry.icon className="w-7 h-7 text-blue-accent" />
                </div>
                <h3 className="mb-3">{industry.title}</h3>
                <p className="text-gray-muted">{industry.description}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
