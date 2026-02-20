'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const data = {
      firstName: formData.get('firstName') as string,
      businessName: formData.get('businessName') as string,
      websiteUrl: formData.get('websiteUrl') as string,
      need: formData.get('need') as string,
      budget: formData.get('budget') as string,
      message: formData.get('message') as string,
    }

    // Basic validation
    const newErrors: Record<string, string> = {}

    if (!data.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!data.businessName.trim()) {
      newErrors.businessName = 'Business name is required'
    }

    if (!data.need) {
      newErrors.need = 'Please select what you need'
    }

    if (!data.budget) {
      newErrors.budget = 'Please select a budget range'
    }

    if (!data.message.trim()) {
      newErrors.message = 'Please tell us about your business'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Here you would send to your backend API
    console.log('Form submitted:', data)

    // For now, just show success
    setIsSubmitted(true)
    setErrors({})
  }

  if (isSubmitted) {
    return (
      <div className="card text-center py-12">
        <div className="text-5xl mb-4">✓</div>
        <h3 className="text-2xl font-bold mb-2">Thanks!</h3>
        <p className="text-gray-muted">
          We'll be in touch within 1 business day.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      {/* First Name */}
      <div>
        <label htmlFor="firstName" className="block font-semibold mb-2">
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-accent ${
            errors.firstName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
        )}
      </div>

      {/* Business Name */}
      <div>
        <label htmlFor="businessName" className="block font-semibold mb-2">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="businessName"
          name="businessName"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-accent ${
            errors.businessName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.businessName && (
          <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
        )}
      </div>

      {/* Website URL */}
      <div>
        <label htmlFor="websiteUrl" className="block font-semibold mb-2">
          Current Website URL <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="url"
          id="websiteUrl"
          name="websiteUrl"
          placeholder="https://example.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-accent"
        />
      </div>

      {/* What do you need? */}
      <div>
        <label htmlFor="need" className="block font-semibold mb-2">
          What do you need? <span className="text-red-500">*</span>
        </label>
        <select
          id="need"
          name="need"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-accent ${
            errors.need ? 'border-red-500' : 'border-gray-300'
          }`}
          defaultValue=""
        >
          <option value="" disabled>
            Select an option
          </option>
          <option value="new-website">New Website</option>
          <option value="redesign">Website Redesign</option>
          <option value="maintenance">Monthly Maintenance</option>
          <option value="not-sure">Not Sure</option>
        </select>
        {errors.need && (
          <p className="text-red-500 text-sm mt-1">{errors.need}</p>
        )}
      </div>

      {/* Budget Range */}
      <div>
        <label htmlFor="budget" className="block font-semibold mb-2">
          Budget Range <span className="text-red-500">*</span>
        </label>
        <select
          id="budget"
          name="budget"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-accent ${
            errors.budget ? 'border-red-500' : 'border-gray-300'
          }`}
          defaultValue=""
        >
          <option value="" disabled>
            Select a range
          </option>
          <option value="under-2000">Under $2,000</option>
          <option value="2000-5000">$2,000–$5,000</option>
          <option value="5000-8000">$5,000–$8,000</option>
          <option value="8000-plus">$8,000+</option>
        </select>
        {errors.budget && (
          <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block font-semibold mb-2">
          Tell us about your business <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-accent ${
            errors.message ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn-primary w-full text-lg">
        Send Message
      </button>
    </form>
  )
}
