'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ReviewPanelProps {
  revisionCount: number
  maxRevisions: number
  onApprove: () => Promise<void>
  onRequestChanges: (notes: string, referenceUrl: string) => Promise<void>
  onStartFresh: (notes: string, referenceUrl: string) => Promise<void>
}

type ActivePanel = null | 'approve' | 'changes' | 'fresh'

export default function ReviewPanel({
  revisionCount,
  maxRevisions,
  onApprove,
  onRequestChanges,
  onStartFresh,
}: ReviewPanelProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)
  const [notes, setNotes] = useState('')
  const [referenceUrl, setReferenceUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmApprove, setShowConfirmApprove] = useState(false)

  const remaining = maxRevisions - revisionCount
  const hasRevisionsLeft = remaining > 0

  const handleApprove = async () => {
    setIsSubmitting(true)
    try {
      await onApprove()
    } finally {
      setIsSubmitting(false)
      setShowConfirmApprove(false)
    }
  }

  const handleSubmitChanges = async () => {
    if (!notes.trim()) return
    setIsSubmitting(true)
    try {
      await onRequestChanges(notes, referenceUrl)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitFresh = async () => {
    if (!notes.trim()) return
    setIsSubmitting(true)
    try {
      await onStartFresh(notes, referenceUrl)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Revision counter */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2">
          {Array.from({ length: maxRevisions }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < revisionCount ? 'bg-yellow-400' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-white/70">
          {remaining === 0
            ? 'All revisions used'
            : remaining === 1
            ? 'Last revision remaining'
            : `${remaining} of ${maxRevisions} revisions remaining`}
        </span>
      </div>

      {/* Action cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Approve card */}
        <motion.button
          onClick={() => {
            setActivePanel(null)
            setShowConfirmApprove(true)
          }}
          className="group relative p-6 rounded-2xl border-2 border-green-500/30 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/50 transition-all text-left"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-green-400 mb-1">Approve Design</h3>
          <p className="text-sm text-white/50">Looks perfect! Finalize and move to delivery.</p>
        </motion.button>

        {/* Request Changes card */}
        <motion.button
          onClick={() => {
            setShowConfirmApprove(false)
            setActivePanel(activePanel === 'changes' ? null : 'changes')
            setNotes('')
            setReferenceUrl('')
          }}
          disabled={!hasRevisionsLeft}
          className={`group relative p-6 rounded-2xl border-2 transition-all text-left ${
            hasRevisionsLeft
              ? 'border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10 hover:border-yellow-500/50'
              : 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
          }`}
          whileHover={hasRevisionsLeft ? { scale: 1.02 } : {}}
          whileTap={hasRevisionsLeft ? { scale: 0.98 } : {}}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
            hasRevisionsLeft ? 'bg-yellow-500/20' : 'bg-white/10'
          }`}>
            <svg className={`w-6 h-6 ${hasRevisionsLeft ? 'text-yellow-400' : 'text-white/30'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </div>
          <h3 className={`text-lg font-bold mb-1 ${hasRevisionsLeft ? 'text-yellow-400' : 'text-white/30'}`}>
            Request Changes
          </h3>
          <p className={`text-sm ${hasRevisionsLeft ? 'text-white/50' : 'text-white/20'}`}>
            {hasRevisionsLeft ? 'Almost there! Tell us what to adjust.' : 'No revisions remaining.'}
          </p>
        </motion.button>

        {/* Start Fresh card */}
        <motion.button
          onClick={() => {
            setShowConfirmApprove(false)
            setActivePanel(activePanel === 'fresh' ? null : 'fresh')
            setNotes('')
            setReferenceUrl('')
          }}
          disabled={!hasRevisionsLeft}
          className={`group relative p-6 rounded-2xl border-2 transition-all text-left ${
            hasRevisionsLeft
              ? 'border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10 hover:border-orange-500/50'
              : 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
          }`}
          whileHover={hasRevisionsLeft ? { scale: 1.02 } : {}}
          whileTap={hasRevisionsLeft ? { scale: 0.98 } : {}}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
            hasRevisionsLeft ? 'bg-orange-500/20' : 'bg-white/10'
          }`}>
            <svg className={`w-6 h-6 ${hasRevisionsLeft ? 'text-orange-400' : 'text-white/30'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
          </div>
          <h3 className={`text-lg font-bold mb-1 ${hasRevisionsLeft ? 'text-orange-400' : 'text-white/30'}`}>
            Start Fresh
          </h3>
          <p className={`text-sm ${hasRevisionsLeft ? 'text-white/50' : 'text-white/20'}`}>
            {hasRevisionsLeft ? 'Want a completely different direction?' : 'No revisions remaining.'}
          </p>
        </motion.button>
      </div>

      {/* Out of revisions notice */}
      {!hasRevisionsLeft && (
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-300">
          You&apos;ve used all {maxRevisions} included revisions. Additional revisions are <strong>$250 each</strong>.
          Contact us at <a href="mailto:support@pegrio.com" className="underline hover:text-yellow-200">support@pegrio.com</a> to purchase more.
        </div>
      )}

      {/* Approve confirmation dialog */}
      <AnimatePresence>
        {showConfirmApprove && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-6 rounded-2xl bg-green-500/10 border border-green-500/30"
          >
            <h4 className="text-lg font-bold text-green-400 mb-2">Confirm Approval</h4>
            <p className="text-sm text-white/70 mb-4">
              Are you sure you want to approve this design? This will finalize the design and begin the delivery process. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Approving...' : 'Yes, Approve Design'}
              </button>
              <button
                onClick={() => setShowConfirmApprove(false)}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Changes / Fresh form */}
      <AnimatePresence>
        {(activePanel === 'changes' || activePanel === 'fresh') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`p-6 rounded-2xl border ${
              activePanel === 'changes'
                ? 'bg-yellow-500/5 border-yellow-500/20'
                : 'bg-orange-500/5 border-orange-500/20'
            }`}
          >
            <h4 className={`text-lg font-bold mb-4 ${
              activePanel === 'changes' ? 'text-yellow-400' : 'text-orange-400'
            }`}>
              {activePanel === 'changes' ? 'What would you like changed?' : 'Describe your new direction'}
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  {activePanel === 'changes' ? 'Describe the changes you want' : 'What style are you looking for?'}
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder={
                    activePanel === 'changes'
                      ? 'e.g., "Make the header larger, change the color scheme to warmer tones, move the CTA button above the fold..."'
                      : 'e.g., "Make it look more like a modern tech company with dark theme and bold typography..."'
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-accent/50 focus:border-purple-accent/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Reference URL <span className="text-white/40">(optional)</span>
                </label>
                <input
                  type="url"
                  value={referenceUrl}
                  onChange={(e) => setReferenceUrl(e.target.value)}
                  placeholder="https://example.com — a website you like"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-accent/50 focus:border-purple-accent/50"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={activePanel === 'changes' ? handleSubmitChanges : handleSubmitFresh}
                  disabled={isSubmitting || !notes.trim()}
                  className={`px-6 py-2.5 rounded-lg font-semibold text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    activePanel === 'changes'
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  {isSubmitting
                    ? 'Submitting...'
                    : activePanel === 'changes'
                    ? 'Submit Changes'
                    : 'Submit Fresh Start'}
                </button>
                <button
                  onClick={() => setActivePanel(null)}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
