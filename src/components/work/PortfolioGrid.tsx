'use client'

import { useState } from 'react'
import ProjectCard from './ProjectCard'

export default function PortfolioGrid() {
  const [activeFilter, setActiveFilter] = useState('All')

  const projects = [
    {
      id: 1,
      name: 'Reliable Plumbing Co.',
      industry: 'Home Services',
      package: 'Starter Package',
      result: 'New site ranking on page 1 for "plumber Katy TX" within 60 days of launch',
      services: [
        '5-page responsive website',
        'Local SEO optimization',
        'Google Maps integration',
        'Mobile-first design',
        'Contact form with instant notifications',
      ],
    },
    {
      id: 2,
      name: 'Peak HVAC Solutions',
      industry: 'Home Services',
      package: 'Growth Package',
      result: 'Rebuilt their outdated site — mobile sessions up significantly, call volume followed',
      services: [
        'Custom 8-page website',
        'Service area pages for Houston, Katy, Sugar Land',
        'Blog system for HVAC tips',
        'Google Analytics 4 setup',
        'Schema markup for local business',
      ],
    },
    {
      id: 3,
      name: 'Summit Roofing Group',
      industry: 'Home Services',
      package: 'Growth Package',
      result: 'Professional site built and live in 18 days — now their #1 consistent source of new leads',
      services: [
        'Fast-tracked custom design',
        'Before/after project gallery',
        'Free estimate request form',
        'Emergency contact CTA',
        'Performance optimization (95 PageSpeed)',
      ],
    },
    {
      id: 4,
      name: 'Lumière Med Spa',
      industry: 'Med Spas',
      package: 'Enterprise Package',
      result: 'High-end custom design with online booking integration — matches the caliber of their brand and clientele',
      services: [
        'Luxury custom design',
        'Online booking system integration',
        'Treatment showcase with before/after',
        'Client testimonials section',
        'Gift card purchase system',
      ],
    },
    {
      id: 5,
      name: 'La Casa de Sabor',
      industry: 'Restaurants',
      package: 'Starter Package',
      result: 'Authentic Mexican restaurant site with full menu, gallery, and contact — clean design that matches the brand',
      demoUrl: '/demos/demo-starter/index.html',
      services: [
        '5-page responsive website',
        'Full menu with categories',
        'Photo gallery',
        'Contact form with Google Maps',
        'Mobile-first design',
      ],
    },
    {
      id: 6,
      name: 'Spice Symphony',
      industry: 'Restaurants',
      package: 'Growth Package',
      result: 'Full online ordering system with cart, checkout, and order confirmation — built for high-volume takeout',
      demoUrl: '/demos/demo-growth/index.html',
      services: [
        'Online ordering system',
        'Shopping cart and checkout flow',
        'Menu with search and filters',
        'Customer reviews integration',
        'Order confirmation system',
      ],
    },
    {
      id: 7,
      name: 'Yuki Izakaya',
      industry: 'Restaurants',
      package: 'Enterprise Package',
      result: 'Premium Japanese restaurant site with AI chatbot, loyalty rewards, admin dashboard, and full e-commerce',
      demoUrl: '/demos/demo-enterprise/index.html',
      services: [
        'Full custom premium design',
        'AI chatbot for customer service',
        'Loyalty rewards program',
        'Admin dashboard with analytics',
        'Online ordering with accounts',
        'Gallery with scroll animations',
      ],
    },
  ]

  const filters = ['All', 'Home Services', 'Med Spas', 'Restaurants']

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter((p) => p.industry === activeFilter)

  return (
    <section className="section bg-gray-bg">
      <div className="container">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-blue-accent text-white'
                  : 'bg-white text-gray-text hover:bg-gray-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
