'use client'

import MotionReveal from '@/components/MotionReveal'

export default function TechStackBar() {
  const technologies = [
    'Next.js',
    'React',
    'Tailwind CSS',
    'Vercel',
    'Stripe',
    'TypeScript',
  ]

  return (
    <section className="py-12 bg-white border-y border-gray-200">
      <div className="container">
        <MotionReveal>
          <p className="text-center text-xs text-gray-muted font-semibold uppercase tracking-widest mb-6">
            Built With Modern Technology
          </p>
        </MotionReveal>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {technologies.map((tech, i) => (
            <MotionReveal key={tech} animation="fade-in" delay={i * 60}>
              <span className="font-mono font-bold text-navy text-base md:text-lg">
                {tech}
              </span>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
