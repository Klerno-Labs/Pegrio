import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Purchase Complete | Pegrio Store',
  robots: { index: false },
}

export default function StoreSuccessPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-white pt-20">
      <div className="container max-w-2xl text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-navy mb-4">Purchase Complete!</h1>

        <p className="text-lg text-gray-muted mb-8 leading-relaxed">
          Thank you for your purchase. You will receive an email with access to the
          source code repository and your free setup guide within the next 24 hours.
          If you have any questions, reach out to us anytime.
        </p>

        <div className="bg-cream rounded-2xl p-6 mb-8 text-left">
          <h3 className="text-lg font-bold text-navy mb-3">What Happens Next</h3>
          <ol className="space-y-3">
            {[
              'We\'ll send you a GitHub repo invite with the full source code.',
              'You\'ll receive a step-by-step setup guide (PDF) via email.',
              'Follow the guide to swap branding, images, and API keys.',
              'Deploy to Vercel with one click — your site goes live.',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-text">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-accent text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/store" className="btn-secondary">
            Back to Store
          </Link>
          <Link href="/contact" className="btn-primary">
            Need Help? Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
