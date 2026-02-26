'use client'

import Link from 'next/link'
import MotionReveal from '@/components/MotionReveal'

export default function HowItWorks() {
  const steps = [
    { number: '1', title: 'Pick Your Industry', description: 'Choose from our library of industry-specific apps or tell us what you need' },
    { number: '2', title: 'Customize It', description: 'We adapt the app to your brand, workflow, and specific business requirements' },
    { number: '3', title: 'Launch Fast', description: 'Your app goes live in days with your branding, domain, and integrations ready' },
    { number: '4', title: 'Grow Together', description: 'Monthly updates, new features, and support to keep your app ahead of the competition' },
  ]

  return (
    <section className="section bg-gray-bg">
      <div className="container">
        <MotionReveal>
          <h2 className="text-center mb-16">How It Works</h2>
        </MotionReveal>

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-8 left-[calc(12.5%+16px)] right-[calc(12.5%+16px)] h-0.5 bg-blue-accent/20" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {steps.map((step, i) => (
              <MotionReveal key={step.number} animation="fade-up" delay={i * 100}>
                <div className="text-center relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-accent text-white text-2xl font-bold mb-4 relative z-10">
                    {step.number}
                  </div>
                  <h3 className="text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-muted text-sm">{step.description}</p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>

        <MotionReveal animation="fade-up" delay={500}>
          <div className="text-center">
            <Link href="/order" className="btn-primary text-lg px-8 py-4 inline-block">
              Get Started Today
            </Link>
          </div>
        </MotionReveal>
      </div>
    </section>
  )
}
