'use client'

import { motion } from 'framer-motion'

interface StatusTrackerProps {
  currentStatus: string
}

const STATUSES = [
  { key: 'paid', label: 'Payment' },
  { key: 'intake', label: 'Questionnaire' },
  { key: 'building', label: 'Building' },
  { key: 'review', label: 'Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'delivered', label: 'Delivered' },
]

// Map revision status to the review step for display
const STATUS_MAP: Record<string, string> = {
  revision: 'building',
  delivering: 'approved',
}

export default function StatusTracker({ currentStatus }: StatusTrackerProps) {
  const effectiveStatus = STATUS_MAP[currentStatus] || currentStatus
  const currentIndex = STATUSES.findIndex((s) => s.key === effectiveStatus)

  return (
    <div className="w-full">
      {/* Desktop stepper */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Background connector line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10" />

        {STATUSES.map((status, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isFuture = index > currentIndex

          return (
            <div key={status.key} className="relative flex flex-col items-center z-10">
              {/* Connector line (filled portion) */}
              {index > 0 && isCompleted && (
                <div
                  className="absolute top-5 right-1/2 h-0.5 bg-green-500"
                  style={{ width: '100%', transform: 'translateX(-50%)' }}
                />
              )}

              {/* Step circle */}
              <div className="relative">
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-purple-accent/30"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ margin: '-4px' }}
                  />
                )}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-purple-accent text-white ring-2 ring-purple-accent/50'
                      : 'bg-white/10 text-white/40'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
              </div>

              {/* Label */}
              <span
                className={`mt-3 text-xs font-medium tracking-wide ${
                  isCompleted
                    ? 'text-green-400'
                    : isCurrent
                    ? 'text-white'
                    : 'text-white/40'
                }`}
              >
                {status.label}
              </span>

              {/* Current status indicator */}
              {isCurrent && currentStatus === 'revision' && (
                <span className="mt-1 text-[10px] text-yellow-400 font-medium">Revising</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile stepper — vertical compact */}
      <div className="md:hidden flex flex-col gap-2">
        {STATUSES.map((status, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex

          return (
            <div key={status.key} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-purple-accent text-white'
                    : 'bg-white/10 text-white/40'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  isCompleted
                    ? 'text-green-400'
                    : isCurrent
                    ? 'text-white'
                    : 'text-white/30'
                }`}
              >
                {status.label}
                {isCurrent && currentStatus === 'revision' && (
                  <span className="ml-2 text-yellow-400 text-xs">(Revising)</span>
                )}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
