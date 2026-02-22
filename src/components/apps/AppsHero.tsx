'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { industries } from '@/data/apps'

export default function AppsHero() {
  const shouldReduceMotion = useReducedMotion()

  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/c-hatfield309/30min'
      })
    }
  }

  const scrollToApps = () => {
    const el = document.getElementById('app-cards')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Double the list for seamless infinite scroll
  const marqueeItems = [...industries, ...industries]

  return (
    <section className="bg-navy text-white relative overflow-hidden pt-32 pb-20">
      {/* Dot-grid background */}
      <div className="absolute inset-0 bg-dots opacity-20" />

      {/* Radial glow */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(107,63,160,0.1) 0%, transparent 70%)' }}
        />
      </div>

      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-display mb-6"
          >
            Industry Apps{' '}
            <span className="gradient-text">Built to Convert</span>
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-10"
          >
            Custom web apps designed for your specific industry. Not generic tools — purpose-built software that solves real problems your business faces every day.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <button onClick={scrollToApps} className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
              See Available Apps
            </button>
            <button onClick={openCalendly} className="text-white hover:text-gold-premium transition-colors font-semibold text-lg w-full sm:w-auto">
              Request a Custom App →
            </button>
          </motion.div>
        </div>

        {/* Marquee ticker */}
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-navy to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-navy to-transparent z-10" />

          <motion.div
            className="flex gap-4 whitespace-nowrap"
            animate={shouldReduceMotion ? {} : { x: ['0%', '-50%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            {marqueeItems.map((industry, i) => (
              <span
                key={`${industry}-${i}`}
                className="inline-block px-4 py-2 rounded-full border border-white/20 text-sm text-gray-400 font-medium"
              >
                {industry}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
