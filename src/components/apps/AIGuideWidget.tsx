'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { MessageCircleQuestion, X, ArrowRight, RotateCcw } from 'lucide-react'

type BusinessType = 'hemp' | 'medspa' | 'restaurant' | 'home-services' | 'other'
type Challenge = string

const businessOptions: { id: BusinessType; label: string }[] = [
  { id: 'hemp', label: 'Hemp / CBD Retail' },
  { id: 'medspa', label: 'Med Spa / Aesthetics' },
  { id: 'restaurant', label: 'Restaurant / Food' },
  { id: 'home-services', label: 'Home Services' },
  { id: 'other', label: 'Something Else' },
]

const challengesByBusiness: Record<BusinessType, { id: string; label: string }[]> = {
  hemp: [
    { id: 'inventory', label: 'Managing inventory & compliance' },
    { id: 'sales', label: 'Tracking sales & analytics' },
    { id: 'customers', label: 'Building customer loyalty' },
    { id: 'online', label: 'Selling online' },
  ],
  medspa: [
    { id: 'booking', label: 'Online booking & scheduling' },
    { id: 'intake', label: 'Client intake & forms' },
    { id: 'marketing', label: 'Before/after galleries' },
    { id: 'retention', label: 'Client retention' },
  ],
  restaurant: [
    { id: 'ordering', label: 'Online ordering' },
    { id: 'reservations', label: 'Table reservations' },
    { id: 'menu', label: 'Digital menu management' },
    { id: 'loyalty', label: 'Loyalty & rewards' },
  ],
  'home-services': [
    { id: 'scheduling', label: 'Job scheduling & dispatch' },
    { id: 'estimates', label: 'Estimates & invoicing' },
    { id: 'customers', label: 'Customer management' },
    { id: 'reviews', label: 'Review collection' },
  ],
  other: [
    { id: 'custom', label: 'I need something custom' },
    { id: 'unsure', label: 'Not sure what I need' },
  ],
}

const recommendations: Record<string, { app: string; message: string }> = {
  'hemp-inventory': { app: 'Hemp Retail Manager', message: 'Our Hemp Retail Manager handles real-time inventory with compliance tracking built in.' },
  'hemp-sales': { app: 'Hemp Retail Manager', message: 'Get sales dashboards with analytics, peak hour tracking, and growth trends.' },
  'hemp-customers': { app: 'Hemp Retail Manager', message: 'Built-in loyalty program with points, rewards, and repeat purchase tracking.' },
  'hemp-online': { app: 'Hemp Retail Manager', message: 'E-commerce with age verification — sell online while staying compliant.' },
  'medspa-booking': { app: 'Med Spa Suite', message: 'Online booking with intake forms and automated reminders — coming soon!' },
  'medspa-intake': { app: 'Med Spa Suite', message: 'Digital intake forms that sync with client profiles — coming soon!' },
  'medspa-marketing': { app: 'Med Spa Suite', message: 'Before/after galleries with consent management — coming soon!' },
  'medspa-retention': { app: 'Med Spa Suite', message: 'Membership & loyalty tools to keep clients coming back — coming soon!' },
  'restaurant-ordering': { app: 'Restaurant Hub', message: 'Full online ordering with cart, checkout, and order tracking — coming soon!' },
  'restaurant-reservations': { app: 'Restaurant Hub', message: 'Table management and reservation system — coming soon!' },
  'restaurant-menu': { app: 'Restaurant Hub', message: 'Real-time digital menu with categories and search — coming soon!' },
  'restaurant-loyalty': { app: 'Restaurant Hub', message: 'Points-based loyalty rewards to turn visitors into regulars — coming soon!' },
  'home-services-scheduling': { app: 'Service Pro', message: 'Job scheduling with dispatch and route optimization — coming soon!' },
  'home-services-estimates': { app: 'Service Pro', message: 'Send professional estimates and convert them into invoices — coming soon!' },
  'home-services-customers': { app: 'Service Pro', message: 'Customer portal with job history and communication — coming soon!' },
  'home-services-reviews': { app: 'Service Pro', message: 'Automated review requests after job completion — coming soon!' },
}

export default function AIGuideWidget() {
  const shouldReduceMotion = useReducedMotion()
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [businessType, setBusinessType] = useState<BusinessType | null>(null)
  const [challenge, setChallenge] = useState<Challenge | null>(null)

  const handleBusinessSelect = (type: BusinessType) => {
    setBusinessType(type)
    setStep(2)
  }

  const handleChallengeSelect = (challengeId: string) => {
    setChallenge(challengeId)
    setStep(3)
  }

  const reset = () => {
    setStep(1)
    setBusinessType(null)
    setChallenge(null)
  }

  const getRecommendation = () => {
    const key = `${businessType}-${challenge}`
    return recommendations[key] || {
      app: 'Custom App',
      message: "We'll build one for you. Start your project and tell us what your business needs.",
    }
  }

  return (
    <>
      {/* Floating trigger pill */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 bg-navy text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
          >
            <MessageCircleQuestion className="w-5 h-5 text-gold-premium" />
            <span className="text-sm font-medium hidden sm:inline">Not sure which app fits?</span>
            <span className="text-sm font-medium sm:hidden">Help me choose</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Widget modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-navy text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircleQuestion className="w-5 h-5 text-gold-premium" />
                <span className="font-semibold text-sm">App Finder</span>
              </div>
              <button
                onClick={() => { setIsOpen(false); reset(); }}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.15 }}
                  >
                    <p className="text-sm text-gray-muted mb-4">What type of business do you run?</p>
                    <div className="space-y-2">
                      {businessOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleBusinessSelect(option.id)}
                          className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-accent hover:bg-blue-accent/5 transition-all text-sm font-medium flex items-center justify-between group"
                        >
                          {option.label}
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-accent transition-colors" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && businessType && (
                  <motion.div
                    key="step2"
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.15 }}
                  >
                    <p className="text-sm text-gray-muted mb-4">What&apos;s your biggest challenge?</p>
                    <div className="space-y-2">
                      {challengesByBusiness[businessType].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleChallengeSelect(option.id)}
                          className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-accent hover:bg-blue-accent/5 transition-all text-sm font-medium flex items-center justify-between group"
                        >
                          {option.label}
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-accent transition-colors" />
                        </button>
                      ))}
                    </div>
                    <button onClick={reset} className="mt-3 text-xs text-gray-muted hover:text-gray-text flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" /> Start over
                    </button>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="text-center py-2">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-premium/10 mb-3">
                        <span className="text-gold-premium text-xl">✓</span>
                      </div>
                      <h4 className="font-bold text-navy mb-1">{getRecommendation().app}</h4>
                      <p className="text-sm text-gray-muted mb-5">{getRecommendation().message}</p>
                      <Link
                        href="/order"
                        className="btn-primary w-full text-sm block text-center"
                        onClick={() => { setIsOpen(false); reset(); }}
                      >
                        Start Your Project
                      </Link>
                      <button onClick={reset} className="mt-3 text-xs text-gray-muted hover:text-gray-text flex items-center gap-1 mx-auto">
                        <RotateCcw className="w-3 h-3" /> Try again
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Step indicator */}
            <div className="px-5 pb-4 flex items-center justify-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    s === step ? 'bg-blue-accent' : s < step ? 'bg-blue-accent/40' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
