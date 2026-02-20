interface Stats {
  totalQuotes: number
  paidQuotes: number
  pendingQuotes: number
  totalRevenue: number
  conversionRate: number
  quotesLast7Days: number
}

export default function StatsGrid({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: 'Total Quotes',
      value: stats.totalQuotes,
      icon: InboxIcon,
      accent: false,
    },
    {
      label: 'Paid',
      value: stats.paidQuotes,
      icon: CheckIcon,
      accent: false,
    },
    {
      label: 'Pending',
      value: stats.pendingQuotes,
      icon: ClockIcon,
      accent: false,
    },
    {
      label: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarIcon,
      accent: true,
    },
    {
      label: 'Conversion',
      value: `${stats.conversionRate}%`,
      icon: TrendIcon,
      accent: false,
    },
    {
      label: 'Last 7 Days',
      value: stats.quotesLast7Days,
      icon: CalendarIcon,
      accent: false,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-white rounded-xl p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
            card.accent ? 'ring-2 ring-purple-accent/20' : ''
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <card.icon className="w-4 h-4 text-gray-muted" />
            <span className="text-xs font-medium text-gray-muted uppercase tracking-wide">{card.label}</span>
          </div>
          <div className={`text-2xl font-bold ${card.accent ? 'text-purple-accent' : 'text-navy'}`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  )
}

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-17.399 0V6.75A2.25 2.25 0 014.5 4.5h15A2.25 2.25 0 0121.75 6.75v6.75" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function DollarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function TrendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
}
