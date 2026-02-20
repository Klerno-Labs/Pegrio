'use client'

import { useState } from 'react'
import StatusBadge from './StatusBadge'

export interface Quote {
  id: number
  customer_name: string
  customer_email: string
  business_name: string | null
  phone: string | null
  package: string
  package_price: number
  payment_type: string | null
  message: string | null
  stripe_session_id: string | null
  payment_status: string
  amount_paid: number | null
  source: string | null
  created_at: string
  paid_at: string | null
}

interface QuotesTableProps {
  quotes: Quote[]
  onSelectQuote: (quote: Quote) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  sortField: string
  onSortChange: (field: string) => void
  sortOrder: string
  page: number
  onPageChange: (page: number) => void
  totalPages: number
}

export default function QuotesTable({
  quotes,
  onSelectQuote,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortField,
  onSortChange,
  sortOrder,
  page,
  onPageChange,
  totalPages,
}: QuotesTableProps) {
  const filters = ['all', 'pending', 'paid', 'failed']

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or business..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-accent/30 focus:border-purple-accent"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => onStatusFilterChange(f)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === f
                  ? 'bg-purple-accent text-white'
                  : 'bg-gray-100 text-gray-text hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <SortableHeader label="Name" field="customer_name" current={sortField} order={sortOrder} onChange={onSortChange} />
              <th className="text-left px-4 py-3 font-semibold text-gray-muted text-xs uppercase tracking-wide">Business</th>
              <SortableHeader label="Package" field="package" current={sortField} order={sortOrder} onChange={onSortChange} />
              <SortableHeader label="Price" field="package_price" current={sortField} order={sortOrder} onChange={onSortChange} />
              <th className="text-left px-4 py-3 font-semibold text-gray-muted text-xs uppercase tracking-wide">Status</th>
              <SortableHeader label="Date" field="created_at" current={sortField} order={sortOrder} onChange={onSortChange} />
            </tr>
          </thead>
          <tbody>
            {quotes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-muted">
                  No quotes found
                </td>
              </tr>
            ) : (
              quotes.map((quote) => (
                <tr
                  key={quote.id}
                  onClick={() => onSelectQuote(quote)}
                  className="border-b border-gray-50 hover:bg-gray-bg/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-navy">{quote.customer_name}</div>
                    <div className="text-xs text-gray-muted">{quote.customer_email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-text">{quote.business_name || '-'}</td>
                  <td className="px-4 py-3 text-gray-text">{quote.package}</td>
                  <td className="px-4 py-3 font-medium text-navy">
                    ${((quote.package_price || 0) / 100).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={quote.payment_status} />
                  </td>
                  <td className="px-4 py-3 text-gray-muted text-xs">
                    {new Date(quote.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-muted">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SortableHeader({
  label,
  field,
  current,
  order,
  onChange,
}: {
  label: string
  field: string
  current: string
  order: string
  onChange: (field: string) => void
}) {
  const isActive = current === field
  return (
    <th
      className="text-left px-4 py-3 font-semibold text-gray-muted text-xs uppercase tracking-wide cursor-pointer select-none hover:text-navy"
      onClick={() => onChange(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        {isActive && (
          <svg className={`w-3 h-3 ${order === 'ASC' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </span>
    </th>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )
}
