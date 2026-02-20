'use client'

import { useState } from 'react'

interface Project {
  id: number
  name: string
  industry: string
  package: string
  result: string
  services: string[]
}

export default function ProjectCard({ project }: { project: Project }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="card">
        <div className="mb-4">
          <h3 className="text-xl mb-2">{project.name}</h3>
          <span className="inline-block bg-blue-light text-blue-accent px-3 py-1 rounded-full text-sm font-medium">
            {project.industry}
          </span>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-muted mb-2">{project.package}</div>
          <p className="text-gray-text">{project.result}</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-secondary w-full"
        >
          View Project
        </button>
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

              <div className="flex gap-3 mb-6">
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

              <div className="bg-success p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Result Achieved</h3>
                <p className="text-gray-text">{project.result}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
