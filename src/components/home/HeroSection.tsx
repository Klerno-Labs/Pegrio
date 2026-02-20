'use client'

export default function HeroSection() {
  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/c-hatfield309/30min'
      })
    }
  }

  const scrollToPortfolio = () => {
    const portfolio = document.getElementById('portfolio-preview')
    if (portfolio) {
      portfolio.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="bg-navy text-white relative overflow-hidden">
      {/* Subtle geometric pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`
        }} />
      </div>

      <div className="container relative py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-6">
            Your Website Should Be Generating Leads. Is It?
          </h1>

          <p className="text-xl md:text-2xl mb-10 text-gray-300 leading-relaxed">
            We build high-performance websites for home service businesses, med spas, and restaurants in Houston, Katy, and across the US — designed to rank on Google and convert visitors into customers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={openCalendly}
              className="btn-primary text-lg px-8 py-4 w-full sm:w-auto"
            >
              Get Your Free Website Audit
            </button>

            <button
              onClick={scrollToPortfolio}
              className="text-white hover:text-blue-light transition-colors font-semibold text-lg w-full sm:w-auto"
            >
              See Our Work →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
