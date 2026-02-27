'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  const scrollToPortfolio = () => {
    const portfolio = document.getElementById('portfolio-preview')
    if (portfolio) {
      portfolio.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="bg-navy text-white relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 hero-gradient-mesh" />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #6B3FA0, transparent)', top: '20%', left: '30%' }}
          animate={shouldReduceMotion ? {} : {
            x: ['-10%', '10%', '-10%'],
            y: ['-10%', '15%', '-10%'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #4A90D9, transparent)', bottom: '10%', right: '20%' }}
          animate={shouldReduceMotion ? {} : {
            x: ['10%', '-10%', '10%'],
            y: ['10%', '-15%', '10%'],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
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
            We Build Websites That{' '}
            <span className="gradient-text">Actually Bring You Customers</span>
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl mb-10 text-gray-300 leading-relaxed"
          >
            Custom websites for home service businesses, med spas, and restaurants in Houston, Katy, and across the US — built to rank on Google and turn visitors into paying customers.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/order"
              className="btn-primary text-lg px-8 py-4 w-full sm:w-auto"
              onClick={() => trackEvent(GA_EVENTS.CTA_CLICK, { location: 'hero', label: 'Start Your Project' })}
            >
              Start Your Project
            </Link>

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
