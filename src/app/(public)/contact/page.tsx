import type { Metadata } from 'next'
import ContactForm from '@/components/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Book a Free Website Audit | Pegrio',
  description: "Book a free 15-minute website audit with Pegrio. No pitch — just honest feedback on what your website is missing and what it's costing your business.",
  openGraph: {
    title: 'Book a Free Website Audit | Pegrio',
    description: "Book a free 15-minute website audit with Pegrio. No pitch — just honest feedback on what your website is missing and what it's costing your business.",
    url: 'https://www.pegrio.com/contact',
  },
  alternates: {
    canonical: 'https://www.pegrio.com/contact',
  },
}

export default function ContactPage() {
  return (
    <>
      {/* Page Header */}
      <section className="section bg-white pt-32">
        <div className="container text-center">
          <h1 className="mb-6">Let's Find Out If Your Website Is Costing You Clients</h1>
          <p className="text-xl text-gray-muted max-w-2xl mx-auto">
            Book a free 15-minute audit or send a message. We respond within 1 business day.
          </p>
        </div>
      </section>

      {/* Two Column Layout */}
      <section className="section bg-gray-bg">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Calendly Embed */}
            <div>
              <h3 className="mb-4">Book a Free 15-Minute Audit</h3>
              <p className="text-gray-muted mb-6">
                No pitch. No pressure. We'll look at your current site (or your competitors') and tell you exactly what we'd change and why.
              </p>

              {/* Calendly Inline Widget */}
              <div
                className="calendly-inline-widget bg-white rounded-xl overflow-hidden shadow-card"
                data-url="https://calendly.com/c-hatfield309/30min"
                style={{ minWidth: '320px', height: '700px' }}
              />
              <script
                type="text/javascript"
                src="https://assets.calendly.com/assets/external/widget.js"
                async
              />
            </div>

            {/* Right Column - Contact Form */}
            <div>
              <h3 className="mb-4">Send Us a Message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
