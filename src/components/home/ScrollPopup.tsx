'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'

export default function ScrollPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('popup-dismissed')
    if (dismissed) return

    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100

      if (scrollPercentage >= 60 && !isVisible) {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isVisible])

  const handleClose = () => {
    setIsVisible(false)
    sessionStorage.setItem('popup-dismissed', 'true')
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')
    const website = formData.get('website')
    console.log('Audit request:', { email, website })

    setIsSubmitted(true)
    trackEvent(GA_EVENTS.POPUP_EMAIL_SUBMIT)
    setTimeout(() => {
      handleClose()
    }, 3000)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full relative"
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-xl transition-colors"
              aria-label="Close"
            >
              ×
            </button>
            <div className="p-6">
              {!isSubmitted ? (
                <>
                  <h3 className="text-2xl font-bold mb-2">Free 5-Minute Video Audit</h3>
                  <p className="text-gray-muted mb-6">
                    Drop your URL and we&apos;ll record a personalized video showing exactly what&apos;s hurting your Google ranking and what to fix first.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="url"
                      name="website"
                      placeholder="https://yourbusiness.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-accent"
                    />

                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Where should we send it?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-accent"
                    />

                    <button type="submit" className="btn-primary w-full">
                      Send My Free Video Audit
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                      No pitch. No spam. Just an honest review.
                    </p>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="text-5xl mb-4">✓</div>
                  <h3 className="text-2xl font-bold mb-2">Got it!</h3>
                  <p className="text-gray-muted">We&apos;ll record your audit and send it over shortly.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
