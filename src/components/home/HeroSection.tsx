'use client'

import { motion, useReducedMotion } from 'framer-motion'

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/c-hatfield309/30min'
      })
    }
  }

  const scrollToPortfolio = () => {
    const portfolio = document.getElementById('portfolio-preview')
    if (portfolio) {
      portfolio.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="bg-navy text-white relative overflow-hidden">
      {/* Dot-grid background pattern */}
      <div className="absolute inset-0 bg-dots opacity-30" />

      {/* Subtle radial glow */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(107,63,160,0.1) 0%, transparent 70%)' }}
        />
      </div>

      <div className="container relative py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Social proof chip */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-gray-300 font-medium">Trusted by Houston businesses</span>
          </motion.div>

          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 font-display"
          >
            Your Website Should Be{' '}
            <span className="gradient-text">Generating Leads.</span>{' '}
            Is It?
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl mb-10 text-gray-300 leading-relaxed"
          >
            We build high-performance websites for home service businesses, med spas, and restaurants in Houston, Katy, and across the US — designed to rank on Google and convert visitors into customers.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={openCalendly}
              className="btn-primary text-lg px-8 py-4 w-full sm:w-auto"
            >
              Get Your Free Website Audit
            </button>

            <button
              onClick={scrollToPortfolio}
              className="text-white hover:text-blue-light transition-colors font-semibold text-lg w-full sm:w-auto"
            >
              See Our Work →
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
