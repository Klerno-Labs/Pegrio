'use client'

import { useState } from 'react'

interface BeforeAfter {
  label: string
  before: string
  after: string
}

interface Project {
  id: number
  name: string
  type: 'Website' | 'App'
  industry: string
  package: string
  result: string
  demoUrl?: string
  beforeUrl?: string
  beforeAfter?: BeforeAfter[]
  services: string[]
}

export default function ProjectCard({ project }: { project: Project }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="card flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl mb-2">{project.name}</h3>
          <div className="flex flex-wrap gap-2">
            {/* Type badge */}
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                project.type === 'App'
                  ? 'bg-gold-light text-gold-premium'
                  : 'bg-blue-light text-blue-accent'
              }`}
            >
              {project.type}
            </span>
            <span className="inline-block bg-blue-light text-blue-accent px-3 py-1 rounded-full text-sm font-medium">
              {project.industry}
            </span>
            <span className="inline-block bg-gray-200 text-gray-text px-3 py-1 rounded-full text-sm font-medium">
              {project.package}
            </span>
          </div>
        </div>

        <p className="text-gray-muted mb-6 flex-grow">{project.result}</p>

        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-secondary flex-1"
          >
            View Details
          </button>
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 text-center"
            >
              Live Site →
            </a>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="float-right text-gray-400 hover:text-gray-600 text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>

              <h2 className="text-3xl font-bold mb-2">{project.name}</h2>

              <div className="flex flex-wrap gap-3 mb-6">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    project.type === 'App'
                      ? 'bg-gold-light text-gold-premium'
                      : 'bg-blue-light text-blue-accent'
                  }`}
                >
                  {project.type}
                </span>
                <span className="inline-block bg-blue-light text-blue-accent px-3 py-1 rounded-full text-sm font-medium">
                  {project.industry}
                </span>
                <span className="inline-block bg-gray-200 text-gray-text px-3 py-1 rounded-full text-sm font-medium">
                  {project.package}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Project Overview</h3>
                <p className="text-gray-text leading-relaxed">
                  {project.result}
                </p>
              </div>

              {/* Before / After Comparison */}
              {project.beforeAfter && project.beforeAfter.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3">Before vs. After</h3>
                  <div className="rounded-lg overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="grid grid-cols-3 bg-gray-100 text-sm font-semibold text-gray-text">
                      <div className="p-3" />
                      <div className="p-3 text-center text-red-500">Before</div>
                      <div className="p-3 text-center text-green-600">After</div>
                    </div>
                    {/* Rows */}
                    {project.beforeAfter.map((row) => (
                      <div key={row.label} className="grid grid-cols-3 border-t border-gray-200 text-sm">
                        <div className="p-3 font-medium text-gray-text">{row.label}</div>
                        <div className="p-3 text-center text-gray-muted">{row.before}</div>
                        <div className="p-3 text-center font-semibold text-gray-text">{row.after}</div>
                      </div>
                    ))}
                  </div>

                  {/* Links to both sites */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {project.beforeUrl && (
                      <a
                        href={project.beforeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center py-2 px-4 rounded-lg border border-gray-300 text-gray-muted text-sm hover:bg-gray-50 transition-colors"
                      >
                        View Old Site →
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center py-2 px-4 rounded-lg bg-blue-accent text-white text-sm hover:bg-blue-accent/90 transition-colors"
                      >
                        View New Site →
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Services Included</h3>
                <ul className="space-y-2">
                  {project.services.map((service) => (
                    <li key={service} className="flex items-start gap-2">
                      <span className="text-blue-accent mt-1">✓</span>
                      <span className="text-gray-text">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-success p-6 rounded-lg mb-6">
                <h3 className="font-bold text-lg mb-2">Result</h3>
                <p className="text-gray-text">{project.result}</p>
              </div>

              {/* Show full-width CTA only if no before/after links shown */}
              {project.demoUrl && !project.beforeAfter && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-center block text-lg"
                >
                  View Live Site →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
