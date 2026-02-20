const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pending' },
  paid: { bg: 'bg-green-50', text: 'text-green-700', label: 'Paid' },
  failed: { bg: 'bg-red-50', text: 'text-red-700', label: 'Failed' },
  refunded: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Refunded' },
}

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.pending
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}
