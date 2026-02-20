import Link from 'next/link'

export default function PortfolioPreview() {
  const projects = [
    {
      name: 'Reliable Plumbing Co.',
      industry: 'Home Services',
      result: 'New site ranking on page 1 for "plumber Katy TX" within 60 days of launch',
    },
    {
      name: 'Lumière Med Spa',
      industry: 'Med Spas & Aesthetics',
      result: 'High-end custom design with online booking integration — matches the caliber of their brand and clientele',
    },
    {
      name: 'The Oak Table Restaurant',
      industry: 'Restaurants & Food',
      result: 'Mobile-first redesign with updated menu, hours, and reservation link — loads in under 2 seconds',
    },
  ]

  return (
    <section className="section bg-gray-bg" id="portfolio-preview">
      <div className="container">
        <h2 className="text-center mb-16">Recent Work</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.name} className="card">
              <div className="mb-4">
                <h3 className="mb-2">{project.name}</h3>
                <span className="inline-block bg-blue-light text-blue-accent px-3 py-1 rounded-full text-sm font-medium">
                  {project.industry}
                </span>
              </div>

              <p className="text-gray-muted mb-4">{project.result}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/work" className="btn-primary">
            View All Work
          </Link>
        </div>
      </div>
    </section>
  )
}
