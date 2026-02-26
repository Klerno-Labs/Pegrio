import type { Metadata } from 'next'
import Link from 'next/link'
import ContactForm from '@/components/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Get Started | Pegrio',
  description: "Ready to grow your business online? Start your project with Pegrio or send us a message. We respond within 1 business day.",
  openGraph: {
    title: 'Get Started | Pegrio',
    description: "Ready to grow your business online? Start your project with Pegrio or send us a message. We respond within 1 business day.",
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
            Start your project or send a message. We respond within 1 business day.
          </p>
        </div>
      </section>

      {/* Two Column Layout */}
      <section className="section bg-gray-bg">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Start Your Project */}
            <div>
              <h3 className="mb-4">Start Your Project</h3>
              <p className="text-gray-muted mb-6">
                No pitch. No pressure. Tell us about your business and we&apos;ll put together a plan tailored to your goals.
              </p>

              <Link
                href="/order"
                className="btn-primary text-lg px-8 py-4 inline-block"
              >
                Get Started
              </Link>
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
