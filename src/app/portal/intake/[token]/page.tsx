'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import IntakeForm from '@/components/portal/IntakeForm'

interface OrderData {
  id: number
  customer_name: string
  customer_email: string
  business_name: string
  tier: number | string
  status: string
  intake_answers: Record<string, any> | null
}

export default function IntakePage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Verify token on mount
  useEffect(() => {
    async function verifyToken() {
      try {
        const res = await fetch(`/api/portal/verify-token?token=${encodeURIComponent(token)}`)
        const data = await res.json()

        if (!res.ok) {
          setError(data.error || 'Invalid portal link')
          return
        }

        // If order is already past intake, redirect to portal
        if (!['paid', 'intake'].includes(data.order.status)) {
          router.replace(`/portal/${token}`)
          return
        }

        setOrder(data.order)
      } catch {
        setError('Something went wrong. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [token, router])

  // Save draft handler
  const handleSave = useCallback(
    async (answers: Record<string, any>) => {
      await fetch('/api/portal/save-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, answers, submit: false }),
      })
    },
    [token]
  )

  // Submit handler
  const handleSubmit = useCallback(
    async (answers: Record<string, any>) => {
      const res = await fetch('/api/portal/save-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, answers, submit: true }),
      })

      if (!res.ok) {
        throw new Error('Failed to submit')
      }

      // Redirect to portal dashboard
      router.push(`/portal/${token}`)
    },
    [token, router]
  )

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-purple-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Loading your questionnaire...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Invalid Link</h1>
          <p className="text-white/50">{error}</p>
          <a
            href="https://www.pegrio.com"
            className="inline-block mt-6 px-6 py-2.5 bg-purple-accent hover:bg-purple-600 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Go to Pegrio.com
          </a>
        </div>
      </div>
    )
  }

  if (!order) return null

  // Determine the tier number
  const tierNumber = typeof order.tier === 'string'
    ? parseInt(order.tier.replace(/\D/g, '')) || 1
    : order.tier || 1

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a1a]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="https://www.pegrio.com" className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white font-display">Pegrio</span>
            </a>
            <span className="text-white/20">|</span>
            <span className="text-sm text-white/50">Questionnaire</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-white">{order.business_name}</p>
            <p className="text-xs text-white/40">Tier {tierNumber}</p>
          </div>
        </div>
      </header>

      {/* Intro */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white font-display mb-3">
            Let&apos;s Build Your Perfect Website
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">
            Answer these questions so we can create a website that truly represents your business.
            Your progress is saved automatically.
          </p>
        </motion.div>

        {/* Form */}
        <IntakeForm
          tier={tierNumber}
          initialData={{
            business_name: order.business_name,
            ...(order.intake_answers || {}),
          }}
          onSave={handleSave}
          onSubmit={handleSubmit}
          portalToken={token}
        />
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-16 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-white/30">
            Pegrio &mdash; Premium Business Websites &middot; Questions? Email{' '}
            <a href="mailto:hello@pegrio.com" className="text-purple-accent/80 hover:text-purple-accent">
              hello@pegrio.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
