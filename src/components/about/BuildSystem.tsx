export default function BuildSystem() {
  const steps = [
    {
      icon: '🔍',
      number: '1',
      title: 'Free Audit',
      description: "We review your current site and tell you exactly what it's missing and what it's costing you",
    },
    {
      icon: '📋',
      number: '2',
      title: 'Strategy',
      description: 'We agree on goals, sitemap, and design direction before a single line of code is written',
    },
    {
      icon: '🎨',
      number: '3',
      title: 'Design',
      description: 'A Figma mockup is created and approved by you before we build anything',
    },
    {
      icon: '⚙️',
      number: '4',
      title: 'Build',
      description: 'Clean, fast, SEO-optimized development. Most projects live in 3 weeks.',
    },
    {
      icon: '🚀',
      number: '5',
      title: 'Launch & Grow',
      description: 'Go live, monitor results, and optimize over time',
    },
  ]

  return (
    <section className="section bg-navy text-white">
      <div className="container">
        <h2 className="text-center mb-4">The Pegrio Build System</h2>
        <p className="text-center text-gray-300 mb-16 max-w-2xl mx-auto">
          Every project follows the same proven process
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="text-5xl mb-4">{step.icon}</div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-accent text-white text-xl font-bold mb-4">
                {step.number}
              </div>
              <h3 className="text-white mb-3">{step.title}</h3>
              <p className="text-gray-300 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
