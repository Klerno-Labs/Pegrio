'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import MotionReveal from '@/components/MotionReveal'

export default function PortfolioPreview() {
  const projects = [
    {
      name: 'THC Plus',
      industry: 'Retail',
      demoUrl: 'https://shopthcplus.com',
      result: 'Full custom Next.js e-commerce site with age verification, product catalog, and modern gradient design — live in Houston',
    },
    {
      name: 'Lumière Med Spa',
      industry: 'Med Spas & Aesthetics',
      result: 'High-end custom design with online booking integration — matches the caliber of their brand and clientele',
    },
    {
      name: 'Yuki Izakaya',
      industry: 'Restaurants & Food',
      demoUrl: '/demos/demo-enterprise/index.html',
      result: 'Premium Japanese restaurant site with AI chatbot, loyalty rewards, admin dashboard, and full e-commerce',
    },
  ]

  return (
    <section className="section bg-gray-bg" id="portfolio-preview">
      <div className="container">
        <MotionReveal>
          <h2 className="text-center mb-16">Recent Work</h2>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <MotionReveal key={project.name} animation="fade-up" delay={i * 100}>
              <motion.div
                className="card h-full flex flex-col"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="mb-4">
                  <h3 className="mb-2">{project.name}</h3>
                  <span className="inline-block bg-blue-light text-blue-accent px-3 py-1 rounded-full text-sm font-medium">
                    {project.industry}
                  </span>
                </div>

                <p className="text-gray-muted mb-4 flex-grow">{project.result}</p>

                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-accent font-semibold link-underline text-sm inline-block"
                  >
                    View Live Demo →
                  </a>
                )}
              </motion.div>
            </MotionReveal>
          ))}
        </div>

        <MotionReveal animation="fade-up" delay={400}>
          <div className="text-center mt-12">
            <Link href="/work" className="btn-primary">
              View All Work
            </Link>
          </div>
        </MotionReveal>
      </div>
    </section>
  )
}
