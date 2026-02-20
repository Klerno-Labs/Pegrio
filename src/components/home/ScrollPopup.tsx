'use client'

import { useState, useEffect } from 'react'

export default function ScrollPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    // Check if popup was already dismissed in this session
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

    // Here you would normally send to your backend
    console.log('Email submitted:', email)

    setIsSubmitted(true)
    setTimeout(() => {
      handleClose()
    }, 3000)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full popup-slide-up">
        <div className="p-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Close"
          >
            ×
          </button>

          {!isSubmitted ? (
            <>
              <h3 className="text-2xl font-bold mb-2">Get a Free Website Audit</h3>
              <p className="text-gray-muted mb-6">
                We'll record a short video reviewing your site — completely free, no strings attached.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-accent"
                />

                <button type="submit" className="btn-primary w-full">
                  Get My Free Audit
                </button>
              </form>
            </>
          ) : (
            <div className="py-8 text-center">
              <div className="text-5xl mb-4">✓</div>
              <h3 className="text-2xl font-bold mb-2">Got it!</h3>
              <p className="text-gray-muted">We'll be in touch shortly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
