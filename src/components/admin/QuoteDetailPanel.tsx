'use client'

import { useState } from 'react'
import type { Quote } from './QuotesTable'
import StatusBadge from './StatusBadge'
import { useToast } from './Toast'

interface QuoteDetailPanelProps {
  quote: Quote
  onClose: () => void
  onSendPayment: (quote: Quote) => void
  onStatusChange: (quoteId: number, status: string) => void
}

export default function QuoteDetailPanel({
  quote,
  onClose,
  onSendPayment,
  onStatusChange,
}: QuoteDetailPanelProps) {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const { addToast } = useToast()

  const statuses = ['pending', 'paid', 'failed', 'refunded']

  const handleStatusChange = async (newStatus: string) => {
    setStatusDropdownOpen(false)
    try {
      const res = await fetch('/api/update-quote-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId: quote.id, status: newStatus }),
      })
      if (res.ok) {
        onStatusChange(quote.id, newStatus)
        addToast(`Status updated to ${newStatus}`, 'success')
      } else {
        addToast('Failed to update status', 'error')
      }
    } catch {
      addToast('Failed to update status', 'error')
    }
  }

  const infoRows = [
    { label: 'Email', value: quote.customer_email },
    { label: 'Phone', value: quote.phone || '-' },
    { label: 'Business', value: quote.business_name || '-' },
    { label: 'Package', value: quote.package },
    { label: 'Price', value: `$${((quote.package_price || 0) / 100).toLocaleString()}` },
    { label: 'Payment Type', value: quote.payment_type || 'Full' },
    { label: 'Source', value: quote.source || 'website' },
    { label: 'Submitted', value: new Date(quote.created_at).toLocaleString() },
    ...(quote.paid_at ? [{ label: 'Paid At', value: new Date(quote.paid_at).toLocaleString() }] : []),
    ...(quote.amount_paid ? [{ label: 'Amount Paid', value: `$${(quote.amount_paid / 100).toLocaleString()}` }] : []),
  ]

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy">{quote.customer_name}</h2>
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

        <div className="p-6 space-y-6">
          {/* Status Row */}
          <div className="flex items-center justify-between">
            <div className="relative">
              <button
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className="flex items-center gap-2 hover:opacity-80"
              >
                <StatusBadge status={quote.payment_status} />
                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {statusDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                  {statuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 capitalize"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-xs text-gray-muted">Quote #{quote.id}</span>
          </div>

          {/* Info Grid */}
          <div className="space-y-3">
            {infoRows.map((row) => (
              <div key={row.label} className="flex items-start justify-between py-2 border-b border-gray-50">
                <span className="text-xs font-medium text-gray-muted uppercase tracking-wide">{row.label}</span>
                <span className="text-sm text-navy font-medium text-right">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Message */}
          {quote.message && (
            <div>
              <h3 className="text-xs font-medium text-gray-muted uppercase tracking-wide mb-2">Message</h3>
              <div className="bg-gray-bg rounded-lg p-4 text-sm text-gray-text leading-relaxed">
                {quote.message}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 space-y-3">
            {quote.payment_status === 'pending' && (
              <button
                onClick={() => onSendPayment(quote)}
                className="btn-primary w-full text-center"
              >
                Send Payment Link
              </button>
            )}
            {quote.customer_email && (
              <a
                href={`mailto:${quote.customer_email}`}
                className="btn-secondary w-full text-center block"
              >
                Email Client
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
