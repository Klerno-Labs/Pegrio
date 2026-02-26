'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreviewFrameProps {
  url: string
  initialDevice?: 'desktop' | 'tablet' | 'mobile'
  showToolbar?: boolean
  onBack?: () => void
}

const DEVICES = {
  desktop: { width: '100%', maxWidth: '1200px', label: 'Desktop', icon: DesktopIcon },
  tablet: { width: '768px', maxWidth: '768px', label: 'Tablet', icon: TabletIcon },
  mobile: { width: '375px', maxWidth: '375px', label: 'Mobile', icon: MobileIcon },
}

export default function PreviewFrame({
  url,
  initialDevice = 'desktop',
  showToolbar = true,
  onBack,
}: PreviewFrameProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>(initialDevice)
  const [isLoading, setIsLoading] = useState(true)

  const currentDevice = DEVICES[device]

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d24] border-b border-white/10">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Portal
              </button>
            )}
          </div>

          {/* Device toggle */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {(Object.keys(DEVICES) as Array<keyof typeof DEVICES>).map((key) => {
              const d = DEVICES[key]
              const isActive = device === key
              return (
                <button
                  key={key}
                  onClick={() => setDevice(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-purple-accent text-white'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  <d.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{d.label}</span>
                </button>
              )
            })}
          </div>

          {/* Open in new tab */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
          >
            <span className="hidden sm:inline">Open in New Tab</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      )}

      {/* Preview area */}
      <div className="flex-1 bg-[#1a1a2e] flex items-start justify-center overflow-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={device}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg overflow-hidden shadow-2xl relative"
            style={{
              width: currentDevice.width,
              maxWidth: currentDevice.maxWidth,
              height: device === 'mobile' ? '700px' : device === 'tablet' ? '900px' : '80vh',
            }}
          >
            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-purple-accent border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-500">Loading preview...</span>
                </div>
              </div>
            )}

            <iframe
              src={url}
              className="w-full h-full border-0"
              onLoad={() => setIsLoading(false)}
              title="Website Preview"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─── Device Icons ─── */

function DesktopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
    </svg>
  )
}

function TabletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25V4.5a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}

function MobileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  )
}
