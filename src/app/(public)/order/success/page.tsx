'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface OrderData {
  customerName: string
  packageName: string
  totalAmount: number
  depositAmount: number
  balanceAmount: number
  portalToken: string
  maintenancePlan: string
  email: string
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-accent border-t-transparent rounded-full" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try to get order data from URL params (set by webhook/redirect)
    const token = searchParams.get('token')
    const name = searchParams.get('name')
    const pkg = searchParams.get('package')
    const total = searchParams.get('total')
    const deposit = searchParams.get('deposit')

    if (token) {
      setOrderData({
        customerName: name || '',
        packageName: pkg || 'Website Build',
        totalAmount: total ? parseInt(total) : 0,
        depositAmount: deposit ? parseInt(deposit) : 0,
        balanceAmount: (total ? parseInt(total) : 0) - (deposit ? parseInt(deposit) : 0),
        portalToken: token,
        maintenancePlan: searchParams.get('maintenance') || 'none',
        email: searchParams.get('email') || '',
      })
      setLoading(false)
    } else {
      // No token yet — the webhook will create the order.
      // Show generic success for now.
      setLoading(false)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-lg w-full"
      >
        {/* Green checkmark animation */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-6"
          >
            <motion.svg
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
              className="w-12 h-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold text-white font-display mb-3"
          >
            Payment Confirmed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-lg"
          >
            Thank you for choosing Pegrio. Your project is officially underway.
          </motion.p>
        </div>

        {/* Order Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6"
        >
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            Order Summary
          </h3>

          {orderData ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Package</span>
                <span className="text-sm font-semibold text-white">{orderData.packageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Total Project Cost</span>
                <span className="text-sm font-semibold text-white">
                  ${orderData.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="text-sm text-green-400 font-semibold">Deposit Paid</span>
                <span className="text-sm font-bold text-green-400">
                  ${orderData.depositAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Balance due at launch</span>
                <span className="text-xs text-gray-500">
                  ${orderData.balanceAmount.toLocaleString()}
                </span>
              </div>
              {orderData.maintenancePlan && orderData.maintenancePlan !== 'none' && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-300">Maintenance Plan</span>
                  <span className="text-sm text-white capitalize">{orderData.maintenancePlan}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-300">
                Your payment has been processed successfully.
              </p>
              {sessionId && (
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Session ID</span>
                  <span className="text-xs text-gray-500 font-mono">
                    {sessionId.substring(0, 24)}...
                  </span>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Confirmation email notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-6"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-accent/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-purple-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">Check Your Email</h4>
              <p className="text-xs text-gray-400">
                We have sent you a confirmation email with all the details, including a link to your
                project portal where you can fill out the website questionnaire.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA: Start Questionnaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          {orderData?.portalToken ? (
            <Link
              href={`/portal/intake/${orderData.portalToken}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-accent text-white rounded-xl text-lg font-bold
                         hover:bg-purple-accent/90 transition-all duration-300
                         shadow-[0_0_30px_rgba(107,63,160,0.3)] hover:shadow-[0_0_40px_rgba(107,63,160,0.5)]"
            >
              Start Your Website Questionnaire
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                Your project portal link will be sent to your email shortly.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-accent text-white rounded-xl text-sm font-bold
                           hover:bg-purple-accent/90 transition-all duration-300
                           shadow-[0_0_20px_rgba(107,63,160,0.25)]"
              >
                Return to Homepage
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}
        </motion.div>

        {/* What happens next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            What Happens Next?
          </h3>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Website Questionnaire', desc: 'Tell us about your business, style preferences, and goals.' },
              { step: '2', title: 'Design Phase', desc: 'Our team creates mockups for your review and feedback.' },
              { step: '3', title: 'Development', desc: 'We build your website with pixel-perfect precision.' },
              { step: '4', title: 'Launch', desc: 'Final review, balance payment, and we go live!' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-purple-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-purple-accent">{item.step}</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
