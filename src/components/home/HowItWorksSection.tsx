'use client'

export default function HowItWorksSection() {
  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/c-hatfield309/30min'
      })
    }
  }

  const steps = [
    {
      number: '1',
      title: 'Free Audit',
      description: "We review your current site (or lack of one) and tell you exactly what's missing and what it's costing you",
    },
    {
      number: '2',
      title: 'We Build',
      description: 'You approve the design, we build it in about 3 weeks, you stay updated the whole way',
    },
    {
      number: '3',
      title: 'You Get Leads',
      description: 'Your site goes live optimized for Google, mobile, and converting visitors into calls and customers',
    },
  ]

  return (
    <section className="section bg-gray-bg">
      <div className="container">
        <h2 className="text-center mb-16">Simple Process. Real Results.</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-accent text-white text-2xl font-bold mb-4">
                {step.number}
              </div>
              <h3 className="mb-3">{step.title}</h3>
              <p className="text-gray-muted">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button onClick={openCalendly} className="btn-primary text-lg px-8 py-4">
            Start With a Free Audit
          </button>
        </div>
      </div>
    </section>
  )
}
