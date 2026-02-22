'use client'

import MotionReveal from '@/components/MotionReveal'
import { Factory, Rocket, HeadphonesIcon } from 'lucide-react'

export default function ValueProposition() {
  const values = [
    {
      icon: Factory,
      title: 'Built for Your Industry',
      description: 'Not a generic tool. Every app is designed around the specific workflows, compliance needs, and customer expectations of your industry.',
    },
    {
      icon: Rocket,
      title: 'Launched in Days',
      description: 'Pre-built industry templates mean your app can be customized and live in days — not the months a custom build would take.',
    },
    {
      icon: HeadphonesIcon,
      title: 'Supported Every Month',
      description: 'Ongoing updates, feature requests, bug fixes, and performance monitoring included. We keep your app running smoothly.',
    },
  ]

  return (
    <section className="section bg-white bg-dots">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, i) => (
            <MotionReveal key={value.title} animation="fade-up" delay={i * 100}>
              <div className="card text-center h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-accent/10 mb-4">
                  <value.icon className="w-7 h-7 text-blue-accent" />
                </div>
                <h3 className="mb-3">{value.title}</h3>
                <p className="text-gray-muted">{value.description}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
