'use client'

import { useState } from 'react'

interface Package {
  id: string
  name: string
  price: number
  icon: string
}

interface ContactModalProps {
  package: Package
  onClose: () => void
}

export default function ContactModal({ package: pkg, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    restaurant: '',
    message: '',
    paymentOption: 'full',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const calculatePrice = (basePrice: number, type: string) => {
    switch (type) {
      case 'full':
        return basePrice * 0.95 // 5% discount
      case 'split':
        return basePrice / 2 // 50% down payment
      case 'monthly':
        return (basePrice - 2000) / 10 // Monthly payment
      default:
        return basePrice
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log('Form submitted:', { ...formData, package: pkg.name })
    setIsSubmitting(false)
    setIsSubmitted(true)

    // In production, you would send this to your backend/email service
    // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-scale-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Success">
              <title>Success checkmark</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
          <p className="text-gray-700 mb-6">
            We've received your inquiry for the <strong>{pkg.name}</strong> package.
            We'll contact you within 24 hours to schedule your free consultation.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary w-full"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full my-8 shadow-2xl animate-scale-in">
        <button
          type="button"
          onClick={onClose}
          className="float-right text-3xl text-gray-400 hover:text-gray-900 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold mb-2">Get Started with {pkg.name}</h2>
        <p className="text-gray-600 mb-6">Fill out the form below and we'll contact you within 24 hours</p>

        <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl mb-2">{pkg.icon}</div>
              <h3 className="text-2xl font-bold">{pkg.name} Package</h3>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-primary-600">
                ${pkg.price.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Starting price</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="restaurant" className="block text-sm font-semibold text-gray-700 mb-2">
                Restaurant Name *
              </label>
              <input
                type="text"
                id="restaurant"
                name="restaurant"
                required
                value={formData.restaurant}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="My Restaurant"
              />
            </div>
          </div>

          <div>
            <label htmlFor="paymentOption" className="block text-sm font-semibold text-gray-700 mb-2">
              Preferred Payment Option
            </label>
            <select
              id="paymentOption"
              name="paymentOption"
              value={formData.paymentOption}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="full">
                Pay in Full - ${calculatePrice(pkg.price, 'full').toLocaleString()} (5% discount)
              </option>
              <option value="split">
                50/50 Split - ${calculatePrice(pkg.price, 'split').toLocaleString()} down
              </option>
              <option value="monthly">
                Monthly Plan - ${calculatePrice(pkg.price, 'monthly').toLocaleString()}/month × 10
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Information
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Tell us about your restaurant, timeline, or any specific requirements..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </div>

          <p className="text-sm text-gray-600 text-center">
            By submitting this form, you agree to receive communication from us about your inquiry.
          </p>
        </form>
      </div>
    </div>
  )
}
