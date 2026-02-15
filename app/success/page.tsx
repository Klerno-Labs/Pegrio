'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    setSessionId(searchParams.get('session_id'))
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-purple-600 to-primary-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 md:p-12 max-w-2xl w-full text-center shadow-2xl">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Success checkmark">
            <title>Success</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Payment Successful! 🎉
        </h1>

        <p className="text-xl text-gray-700 mb-6">
          Thank you for your purchase! We'll get started on your restaurant website right away.
        </p>

        <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
          <h2 className="font-bold text-lg mb-4 text-gray-900">What Happens Next?</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-primary-600 font-bold">1.</span>
              <span>You'll receive a confirmation email within the next hour with project details</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 font-bold">2.</span>
              <span>Our team will contact you within 24 hours to schedule a kickoff call</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 font-bold">3.</span>
              <span>We'll gather your content (menu, photos, branding) during onboarding</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 font-bold">4.</span>
              <span>Your website will be ready within 2-4 weeks (depending on package)</span>
            </li>
          </ul>
        </div>

        {sessionId && (
          <p className="text-sm text-gray-500 mb-6">
            Session ID: {sessionId}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            Back to Home
          </a>
          <a
            href="mailto:support@example.com"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold border-2 border-primary-600 text-primary-600 hover:bg-primary-50 transition-colors"
          >
            Contact Support
          </a>
        </div>

        <p className="mt-8 text-gray-600">
          Need help? Email us at{' '}
          <a href="mailto:support@example.com" className="text-primary-600 font-semibold hover:underline">
            support@example.com
          </a>
        </p>
      </div>
    </div>
  )
}
