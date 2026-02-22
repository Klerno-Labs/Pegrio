'use client'

import { useEffect, useRef, useState } from 'react'

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let start = 0
          const duration = 1500
          const startTime = performance.now()

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = Math.round(eased * target)
            setCount(current)

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, hasAnimated])

  return (
    <span ref={ref} className="font-mono text-blue-accent font-bold text-lg">
      {count}{suffix}
    </span>
  )
}

export default function SocialProofBar() {
  const stats = [
    { number: 50, suffix: '+', label: 'Websites Built' },
    { number: 90, suffix: '+', label: 'PageSpeed Score' },
    { number: 3, suffix: '-Week', label: 'Avg Delivery' },
  ]

  return (
    <section className="bg-gray-bg py-8 border-y border-gray-200">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 text-center">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-8">
              <div className="flex flex-col items-center gap-1">
                <CountUp target={stat.number} suffix={stat.suffix} />
                <span className="text-gray-muted text-sm font-medium">{stat.label}</span>
              </div>
              {index < stats.length - 1 && (
                <div className="hidden md:block h-10 w-px bg-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
