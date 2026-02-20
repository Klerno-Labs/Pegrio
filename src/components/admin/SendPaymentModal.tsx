'use client'

import { useState } from 'react'
import type { Quote } from './QuotesTable'
import { useToast } from './Toast'

interface SendPaymentModalProps {
  quote: Quote
  onClose: () => void
  onSuccess: () => void
}

export default function SendPaymentModal({ quote, onClose, onSuccess }: SendPaymentModalProps) {
  const priceInDollars = (quote.package_price || 0) / 100
  const [amount, setAmount] = useState(priceInDollars.toString())
  const [paymentType, setPaymentType] = useState<'full' | 'deposit'>('full')
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const effectiveAmount = paymentType === 'deposit' ? Math.round(parseFloat(amount) * 0.5) : parseFloat(amount)

  const handleSend = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/send-payment-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId: quote.id,
          customerName: quote.customer_name,
          customerEmail: quote.customer_email,
          amount: effectiveAmount,
          packageName: quote.package,
          paymentType,
        }),
      })

      if (res.ok) {
        addToast(`Payment link sent to ${quote.customer_email}`, 'success')
        onSuccess()
        onClose()
      } else {
        const data = await res.json()
        addToast(data.error || 'Failed to send payment link', 'error')
      }
    } catch {
      addToast('Failed to send payment link', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-2xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">Send Payment Link</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Recipient Info */}
            <div className="bg-gray-bg rounded-lg p-4">
              <div className="text-sm">
                <span className="text-gray-muted">To:</span>{' '}
                <span className="font-medium text-navy">{quote.customer_name}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-muted">Email:</span>{' '}
                <span className="font-medium text-navy">{quote.customer_email}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-muted">Package:</span>{' '}
                <span className="font-medium text-navy">{quote.package}</span>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-text mb-2">Amount ($)</label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-accent/30 focus:border-purple-accent"
              />
            </div>

            {/* Payment Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-text mb-2">Payment Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentType('full')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                    paymentType === 'full'
                      ? 'border-purple-accent bg-purple-accent/5 text-purple-accent'
                      : 'border-gray-200 text-gray-text hover:border-gray-300'
                  }`}
                >
                  Full Payment
                </button>
                <button
                  onClick={() => setPaymentType('deposit')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                    paymentType === 'deposit'
                      ? 'border-purple-accent bg-purple-accent/5 text-purple-accent'
                      : 'border-gray-200 text-gray-text hover:border-gray-300'
                  }`}
                >
                  50% Deposit
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-navy rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Amount to charge:</span>
                <span className="text-2xl font-bold">${effectiveAmount.toLocaleString()}</span>
              </div>
              {paymentType === 'deposit' && (
                <p className="text-xs text-gray-400 mt-1">50% deposit of ${parseFloat(amount).toLocaleString()}</p>
              )}
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={loading || !amount || effectiveAmount <= 0}
              className="btn-primary w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : `Send Payment Link to ${quote.customer_name}`}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
