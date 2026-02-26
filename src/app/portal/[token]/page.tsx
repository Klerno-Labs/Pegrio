'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import StatusTracker from '@/components/portal/StatusTracker'
import PreviewFrame from '@/components/portal/PreviewFrame'
import ReviewPanel from '@/components/portal/ReviewPanel'

/* ─── Types ─── */

interface Order {
  id: number
  customer_name: string
  customer_email: string
  business_name: string
  phone: string
  tier: number | string
  maintenance_plan: string | null
  add_ons: any
  total_amount: number
  deposit_amount: number
  balance_amount: number
  payment_status: string
  portal_token: string
  status: string
  intake_answers: Record<string, any> | null
  preview_url: string | null
  revision_count: number
  max_revisions: number
  revision_notes: any[] | null
  delivery_type: string | null
  delivered_at: string | null
  created_at: string
  updated_at: string
}

interface OrderEvent {
  id: number
  order_id: number
  event_type: string
  details: any
  created_at: string
}

/* ─── Helpers ─── */

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getTierNumber(tier: number | string): number {
  if (typeof tier === 'number') return tier
  return parseInt(String(tier).replace(/\D/g, '')) || 1
}

function getEstimatedTimeline(tier: number | string): string {
  const t = getTierNumber(tier)
  if (t >= 3) return '10-14 business days'
  if (t >= 2) return '7-10 business days'
  return '5-7 business days'
}

const EVENT_LABELS: Record<string, string> = {
  order_created: 'Order created',
  payment_received: 'Payment received',
  intake_submitted: 'Questionnaire completed',
  build_started: 'Website build started',
  preview_ready: 'Preview ready for review',
  revision_requested: 'Design changes requested',
  revision_fresh_start: 'Fresh start requested',
  revision_completed: 'Revision completed',
  design_approved: 'Design approved',
  delivery_started: 'Delivery in progress',
  delivered: 'Website delivered',
}

/* ─── Main Component ─── */

export default function PortalPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [order, setOrder] = useState<Order | null>(null)
  const [events, setEvents] = useState<OrderEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionMessage, setActionMessage] = useState('')

  // Fetch order data
  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/portal/get-order?token=${encodeURIComponent(token)}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to load order')
        return
      }

      setOrder(data.order)
      setEvents(data.events || [])
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  // Review action handlers
  const handleApprove = async () => {
    const res = await fetch('/api/portal/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, action: 'approve' }),
    })
    const data = await res.json()
    if (res.ok) {
      setActionMessage('Design approved! Preparing for delivery...')
      fetchOrder()
    } else {
      setActionMessage(data.error || 'Failed to approve')
    }
  }

  const handleRequestChanges = async (notes: string, referenceUrl: string) => {
    const res = await fetch('/api/portal/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, action: 'changes', notes, reference_url: referenceUrl }),
    })
    const data = await res.json()
    if (res.ok) {
      setActionMessage('Revision request submitted! We\'ll get to work on your changes.')
      fetchOrder()
    } else {
      setActionMessage(data.message || data.error || 'Failed to submit')
    }
  }

  const handleStartFresh = async (notes: string, referenceUrl: string) => {
    const res = await fetch('/api/portal/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, action: 'fresh', notes, reference_url: referenceUrl }),
    })
    const data = await res.json()
    if (res.ok) {
      setActionMessage('Fresh start request submitted! We\'ll create a new direction for you.')
      fetchOrder()
    } else {
      setActionMessage(data.message || data.error || 'Failed to submit')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-purple-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Loading your project...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Unable to Load</h1>
          <p className="text-white/50">{error || 'Order not found'}</p>
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

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a1a]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="https://www.pegrio.com" className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white font-display">Pegrio</span>
            </a>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span className="text-sm text-white/50 hidden sm:inline">Client Portal</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-white">{order.business_name}</p>
            <p className="text-xs text-white/40">Order #{order.id}</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Status Tracker */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5"
        >
          <h2 className="text-lg font-bold text-white mb-6 font-display">Project Status</h2>
          <StatusTracker currentStatus={order.status} />
        </motion.section>

        {/* Action message toast */}
        <AnimatePresence>
          {actionMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-purple-accent/20 border border-purple-accent/30 text-sm text-white flex items-center justify-between"
            >
              <span>{actionMessage}</span>
              <button onClick={() => setActionMessage('')} className="text-white/50 hover:text-white ml-4">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Status-specific content ─── */}

        {/* PAID — needs to fill out questionnaire */}
        {order.status === 'paid' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-purple-accent/10 to-purple-accent/5 border border-purple-accent/20 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-purple-accent/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-purple-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-display mb-3">
              Complete Your Questionnaire
            </h2>
            <p className="text-white/50 max-w-lg mx-auto mb-8">
              To get started on your website, we need some information about your business, brand, and design preferences.
              It takes about 10-15 minutes.
            </p>
            <a
              href={`/portal/intake/${token}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-purple-accent hover:bg-purple-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-purple-accent/25"
            >
              Start Questionnaire
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </motion.section>
        )}

        {/* INTAKE — waiting for questionnaire completion */}
        {order.status === 'intake' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-display mb-3">
              Finish Your Questionnaire
            </h2>
            <p className="text-white/50 max-w-lg mx-auto mb-8">
              It looks like you started the questionnaire but haven&apos;t submitted it yet.
              Your progress has been saved - pick up where you left off!
            </p>
            <a
              href={`/portal/intake/${token}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl font-bold transition-colors"
            >
              Continue Questionnaire
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </motion.section>
        )}

        {/* BUILDING — website is being built */}
        {order.status === 'building' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-accent/5 border border-blue-500/20 text-center"
          >
            {/* Animated building indicator */}
            <div className="w-24 h-24 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6 relative">
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-blue-500/30"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <svg className="w-12 h-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.04-3.74a1 1 0 010-1.61l5.04-3.74a1.002 1.002 0 011.58.85V8.5l4.09-3.04a1 1 0 011.58.85v10.38a1 1 0 01-1.58.85L13 14.5v2.33a1 1 0 01-1.58.85z" />
              </svg>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white font-display mb-3">
              We&apos;re Building Your Website!
            </h2>
            <p className="text-white/50 max-w-lg mx-auto mb-6">
              Our team is hard at work creating your website. You&apos;ll receive an email when it&apos;s ready for your review.
            </p>

            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
              <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-white/60">
                Estimated delivery: <strong className="text-white">{getEstimatedTimeline(order.tier)}</strong>
              </span>
            </div>
          </motion.section>
        )}

        {/* REVIEW — preview is ready for client review */}
        {order.status === 'review' && (
          <>
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white font-display">Preview Your Website</h2>
                <a
                  href={`/portal/${token}/review`}
                  className="text-sm text-purple-accent hover:text-purple-400 font-medium flex items-center gap-1 transition-colors"
                >
                  Full-screen Preview
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </a>
              </div>

              {order.preview_url ? (
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d24]" style={{ height: '500px' }}>
                  <PreviewFrame url={order.preview_url} />
                </div>
              ) : (
                <div className="p-12 rounded-2xl border border-white/10 bg-white/[0.02] text-center">
                  <p className="text-white/50">Preview URL not yet available. Check back soon!</p>
                </div>
              )}
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-white font-display mb-6">Your Review</h2>
              <ReviewPanel
                revisionCount={order.revision_count || 0}
                maxRevisions={order.max_revisions || 2}
                onApprove={handleApprove}
                onRequestChanges={handleRequestChanges}
                onStartFresh={handleStartFresh}
              />
            </motion.section>
          </>
        )}

        {/* REVISION — working on requested changes */}
        {order.status === 'revision' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
              <motion.svg
                className="w-10 h-10 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </motion.svg>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white font-display mb-3">
              Working on Your Changes
            </h2>
            <p className="text-white/50 max-w-lg mx-auto mb-8">
              We&apos;re implementing the changes you requested. You&apos;ll receive an email when the updated design is ready for review.
            </p>

            {/* Show their last revision note */}
            {order.revision_notes && order.revision_notes.length > 0 && (
              <div className="max-w-lg mx-auto mt-6 text-left">
                <h3 className="text-sm font-semibold text-white/60 mb-3">Your Feedback:</h3>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-white/70 whitespace-pre-wrap">
                    {order.revision_notes[order.revision_notes.length - 1]?.notes || 'No notes'}
                  </p>
                  {order.revision_notes[order.revision_notes.length - 1]?.reference_url && (
                    <a
                      href={order.revision_notes[order.revision_notes.length - 1].reference_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-accent text-sm hover:underline mt-2 inline-block"
                    >
                      Reference link
                    </a>
                  )}
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* APPROVED — choose delivery method */}
        {order.status === 'approved' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white font-display mb-3">
                Your Design is Approved!
              </h2>
              <p className="text-white/50 max-w-lg mx-auto">
                Choose how you&apos;d like to receive your website.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Managed Hosting */}
              <div className="p-8 rounded-2xl border-2 border-purple-accent/30 bg-purple-accent/5 hover:bg-purple-accent/10 transition-all">
                <div className="w-14 h-14 rounded-xl bg-purple-accent/20 flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-purple-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-purple-accent mb-2">Managed Hosting</h3>
                <p className="text-sm text-white/50 mb-4">
                  We host and maintain your website. Includes uptime monitoring, SSL, and ongoing support.
                </p>
                {order.maintenance_plan && (
                  <div className="px-3 py-1.5 rounded-lg bg-purple-accent/10 text-xs text-purple-accent font-medium inline-block mb-4">
                    {order.maintenance_plan} plan included
                  </div>
                )}
                <button className="w-full px-6 py-3 bg-purple-accent hover:bg-purple-600 text-white rounded-xl font-semibold transition-colors">
                  Confirm Managed Hosting
                </button>
              </div>

              {/* Download Package */}
              <div className="p-8 rounded-2xl border-2 border-blue-400/30 bg-blue-400/5 hover:bg-blue-400/10 transition-all">
                <div className="w-14 h-14 rounded-xl bg-blue-400/20 flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-400 mb-2">Download Package</h3>
                <p className="text-sm text-white/50 mb-4">
                  Receive your complete website as a download. You&apos;ll need to set up your own hosting.
                </p>
                <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/40 text-center">
                  Preparing your package...
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* DELIVERED — website is live */}
        {(order.status === 'delivered' || order.status === 'delivering') && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 text-center"
          >
            {/* Celebration */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </motion.div>

            <h2 className="text-2xl md:text-3xl font-bold text-white font-display mb-3">
              Your Website Has Been Delivered!
            </h2>

            {order.delivery_type === 'managed' && order.preview_url ? (
              <div className="max-w-lg mx-auto">
                <p className="text-white/50 mb-6">
                  Your website is live and being managed by our team.
                </p>
                <a
                  href={order.preview_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors"
                >
                  Visit Your Website
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            ) : (
              <div className="max-w-lg mx-auto">
                <p className="text-white/50 mb-6">
                  Your website package is ready for download.
                </p>
                <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download Website Package
                </button>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/10 max-w-lg mx-auto">
              <p className="text-sm text-white/40">
                Need help? Contact us at{' '}
                <a href="mailto:support@pegrio.com" className="text-purple-accent hover:underline">
                  support@pegrio.com
                </a>
              </p>
              {order.maintenance_plan && (
                <p className="text-sm text-white/40 mt-2">
                  Your <strong className="text-white/60">{order.maintenance_plan}</strong> support plan is active.
                </p>
              )}
            </div>
          </motion.section>
        )}

        {/* ─── Activity Timeline ─── */}
        {events.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5"
          >
            <h2 className="text-lg font-bold text-white mb-6 font-display">Activity Timeline</h2>
            <div className="space-y-0">
              {events.map((event, index) => (
                <div key={event.id} className="flex gap-4">
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      index === events.length - 1 ? 'bg-purple-accent' : 'bg-white/20'
                    }`} />
                    {index < events.length - 1 && (
                      <div className="w-px h-full min-h-[40px] bg-white/10" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-6">
                    <p className="text-sm font-medium text-white">
                      {EVENT_LABELS[event.event_type] || event.event_type}
                    </p>
                    {event.details?.message && (
                      <p className="text-xs text-white/40 mt-0.5">{event.details.message}</p>
                    )}
                    <p className="text-xs text-white/30 mt-1">{formatDate(event.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-8 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
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
