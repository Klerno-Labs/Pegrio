'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
  title: string
}

export default function PreviewModal({ isOpen, onClose, url, title }: PreviewModalProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isLoading, setIsLoading] = useState(true)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
      setIsLoading(true)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  const widthMap = {
    desktop: 'w-full max-w-6xl',
    tablet: 'w-full max-w-[768px]',
    mobile: 'w-full max-w-[375px]',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`${widthMap[viewMode]} h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-300`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-600 truncate max-w-xs">
                  {title}
                </span>
              </div>

              {/* Device Switcher */}
              <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'desktop' ? 'bg-purple-accent text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  aria-label="Desktop view"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('tablet')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'tablet' ? 'bg-purple-accent text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  aria-label="Tablet view"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'mobile' ? 'bg-purple-accent text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  aria-label="Mobile view"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Close preview"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Iframe */}
            <div className="relative h-[calc(100%-52px)] bg-gray-100 flex items-start justify-center overflow-auto">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-purple-accent border-t-transparent rounded-full mx-auto mb-3" />
                    <p className="text-sm text-gray-muted">Loading preview...</p>
                  </div>
                </div>
              )}
              <iframe
                src={url}
                title={`Preview of ${title}`}
                className="w-full h-full border-0"
                onLoad={() => setIsLoading(false)}
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
