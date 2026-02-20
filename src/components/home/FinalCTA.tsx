'use client'

export default function FinalCTA() {
  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/c-hatfield309/30min'
      })
    }
  }

  return (
    <section className="bg-navy text-white py-20">
      <div className="container text-center">
        <h2 className="mb-4">Find Out What Your Website Is Costing You</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Free 15-minute audit. No pitch. Just honest feedback.
        </p>

        <button onClick={openCalendly} className="btn-primary text-lg px-8 py-4 bg-white text-navy hover:bg-gray-100">
          Book My Free Audit
        </button>
      </div>
    </section>
  )
}
