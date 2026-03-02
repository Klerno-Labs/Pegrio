'use client'

import Link from 'next/link'
import MotionReveal from '@/components/MotionReveal'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'

interface BlogCTAProps {
  ctaText: string
  ctaHref: string
}

export default function BlogCTA({ ctaText, ctaHref }: BlogCTAProps) {
  return (
    <MotionReveal animation="scale-in">
      <div className="bg-navy text-white p-8 md:p-12 rounded-2xl text-center mt-12">
        <h3 className="text-2xl font-bold font-display mb-3">Ready to get started?</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Let&apos;s talk about what your business needs online. No pitch — just an honest conversation.
        </p>
        <Link
          href={ctaHref}
          className="btn-primary inline-block"
          onClick={() => trackEvent(GA_EVENTS.BLOG_CTA_CLICK, { label: ctaText, href: ctaHref })}
        >
          {ctaText}
        </Link>
      </div>
    </MotionReveal>
  )
}
