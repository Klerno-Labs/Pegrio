'use client'

import Link from 'next/link'
import BuildSystem from './BuildSystem'

export default function AboutContent() {
  return (
    <>
      {/* Page Header */}
      <section className="section bg-white pt-32">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Founder avatar */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-navy flex items-center justify-center">
                <span className="text-2xl font-bold text-white font-display">CH</span>
              </div>
            </div>

            <h1 className="mb-8 text-center">Built by a Developer Who Gets Local Business</h1>

            <div className="prose prose-lg max-w-none text-gray-text space-y-6">
              <p>
                I&apos;m Chris, the founder of Pegrio. I started this company because I kept seeing the same problem: local businesses with real expertise, loyal customers, and strong reputations — but websites that made them look like amateurs.
              </p>

              <p>
                Most small business owners don&apos;t have time to become web developers. They need someone they can trust to handle it right the first time and keep it running without drama.
              </p>

              <p>
                That&apos;s what Pegrio does. We work with home service businesses, med spas, restaurants, and local companies across Houston, Katy, and the entire US. Every project is scoped clearly, priced fairly, delivered on time, and built to generate real results — not just look good.
              </p>

              <p className="font-semibold text-navy text-xl">
                Every day your website underperforms, you&apos;re losing potential customers to competitors who got theirs right. We make sure that doesn&apos;t happen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Credentials */}
      <section className="py-16 bg-gray-bg">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-navy font-mono mb-2">12+</div>
                <p className="text-gray-muted text-sm">Projects Delivered</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-navy font-mono mb-2">4</div>
                <p className="text-gray-muted text-sm">Industries Served</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-navy font-mono mb-2">90+</div>
                <p className="text-gray-muted text-sm">Avg PageSpeed Score</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BuildSystem />

      {/* Bottom CTA */}
      <section className="section bg-gray-bg">
        <div className="container text-center">
          <h2 className="mb-6">Work With Us</h2>
          <p className="text-xl text-gray-muted mb-8 max-w-2xl mx-auto">
            Ready for a website that actually works as hard as you do?
          </p>
          <Link
            href="/order"
            className="btn-primary text-lg px-8 py-4 inline-block"
          >
            Start Your Project
          </Link>
        </div>
      </section>
    </>
  )
}
