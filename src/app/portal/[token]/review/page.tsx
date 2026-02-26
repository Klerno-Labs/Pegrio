'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import PreviewFrame from '@/components/portal/PreviewFrame'

export default function FullPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/portal/verify-token?token=${encodeURIComponent(token)}`)
        const data = await res.json()

        if (!res.ok) {
          setError(data.error || 'Invalid link')
          return
        }

        if (!data.order.preview_url) {
          setError('Preview is not yet available')
          return
        }

        setPreviewUrl(data.order.preview_url)
      } catch {
        setError('Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [token])

  if (loading) {
    return (
      <div className="h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-purple-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (error || !previewUrl) {
    return (
      <div className="h-screen bg-[#0a0a1a] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Preview Unavailable</h1>
          <p className="text-white/50 mb-6">{error || 'No preview URL available'}</p>
          <button
            onClick={() => router.push(`/portal/${token}`)}
            className="px-6 py-2.5 bg-purple-accent hover:bg-purple-600 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Back to Portal
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-[#0a0a1a] flex flex-col">
      <PreviewFrame
        url={previewUrl}
        showToolbar={true}
        onBack={() => router.push(`/portal/${token}`)}
      />
    </div>
  )
}
