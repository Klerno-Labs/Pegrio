'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import StatsGrid from '@/components/admin/StatsGrid'
import QuotesTable, { type Quote } from '@/components/admin/QuotesTable'
import QuoteDetailPanel from '@/components/admin/QuoteDetailPanel'
import SendPaymentModal from '@/components/admin/SendPaymentModal'
import { ToastProvider } from '@/components/admin/Toast'
import { StatsGridSkeleton, TableSkeleton } from '@/components/admin/LoadingSkeleton'

interface Stats {
  totalQuotes: number
  paidQuotes: number
  pendingQuotes: number
  totalRevenue: number
  conversionRate: number
  quotesLast7Days: number
}

const ITEMS_PER_PAGE = 10

export default function AdminDashboard() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  )
}

function DashboardContent() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [paymentQuote, setPaymentQuote] = useState<Quote | null>(null)

  // Filters & pagination
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('DESC')
  const [page, setPage] = useState(1)
  const [totalQuotes, setTotalQuotes] = useState(0)

  const totalPages = Math.ceil(totalQuotes / ITEMS_PER_PAGE)

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        limit: ITEMS_PER_PAGE.toString(),
        offset: ((page - 1) * ITEMS_PER_PAGE).toString(),
        sort: sortField,
        order: sortOrder,
      })

      if (statusFilter !== 'all') {
        params.set('status', statusFilter)
      }

      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim())
      }

      const res = await fetch(`/api/get-quotes?${params}`, {
        credentials: 'include',
      })

      if (res.status === 401) {
        router.push('/admin/login')
        return
      }

      if (!res.ok) throw new Error('Failed to fetch')

      const data = await res.json()
      setQuotes(data.quotes)
      setStats(data.stats)
      setTotalQuotes(data.pagination.total)
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, searchQuery, sortField, sortOrder, router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Use debounced search in fetch
  useEffect(() => {
    fetchData()
  }, [debouncedSearch]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSortChange = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')
    } else {
      setSortField(field)
      setSortOrder('DESC')
    }
    setPage(1)
  }

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status)
    setPage(1)
  }

  const handleStatusUpdate = (quoteId: number, newStatus: string) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, payment_status: newStatus } : q))
    )
    if (selectedQuote?.id === quoteId) {
      setSelectedQuote({ ...selectedQuote, payment_status: newStatus })
    }
    fetchData()
  }

  return (
    <div>
      {/* Stats */}
      {loading || !stats ? (
        <StatsGridSkeleton />
      ) : (
        <StatsGrid stats={stats} />
      )}

      {/* Quotes heading */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-navy">Quotes</h2>
        <span className="text-xs text-gray-muted">{totalQuotes} total</span>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <QuotesTable
          quotes={quotes}
          onSelectQuote={setSelectedQuote}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          sortField={sortField}
          onSortChange={handleSortChange}
          sortOrder={sortOrder}
          page={page}
          onPageChange={setPage}
          totalPages={totalPages}
        />
      )}

      {/* Detail Panel */}
      {selectedQuote && (
        <QuoteDetailPanel
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
          onSendPayment={(q) => {
            setPaymentQuote(q)
            setSelectedQuote(null)
          }}
          onStatusChange={handleStatusUpdate}
        />
      )}

      {/* Payment Modal */}
      {paymentQuote && (
        <SendPaymentModal
          quote={paymentQuote}
          onClose={() => setPaymentQuote(null)}
          onSuccess={fetchData}
        />
      )}
    </div>
  )
}
