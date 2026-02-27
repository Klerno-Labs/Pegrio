'use client'

import { useState } from 'react'
import ProjectCard from './ProjectCard'

export default function PortfolioGrid() {
  const [activeFilter, setActiveFilter] = useState('All')

  const projects = [
    {
      id: 0,
      name: 'THC Plus',
      type: 'Website' as const,
      industry: 'Retail',
      package: 'Enterprise Package',
      highlight: 'Custom Next.js e-commerce',
      result: 'Full custom Next.js e-commerce site for a Houston hemp retailer — age verification, product browsing, modern gradient design, and error monitoring with Sentry',
      demoUrl: 'https://shopthcplus.com',
      beforeUrl: 'https://3rdcoastsmokecompany.com',
      beforeAfter: [
        { label: 'Platform', before: 'GoDaddy Builder', after: 'Custom Next.js' },
        { label: 'Design', before: 'Generic template', after: 'Fully custom' },
        { label: 'CSS Size', before: '~200KB bloated', after: '<20KB optimized' },
        { label: 'Features', before: 'Contact form only', after: 'E-commerce + age gate' },
        { label: 'Error Tracking', before: 'None', after: 'Sentry monitoring' },
        { label: 'Mobile UX', before: 'Basic responsive', after: 'Mobile-first design' },
      ],
      services: [
        'Custom Next.js + Tailwind CSS build',
        'Age verification gate (21+)',
        'Product catalog with browsing',
        'Mobile-responsive modern design',
        'Sentry error monitoring integration',
        'SEO optimization with structured data',
      ],
    },
    {
      id: 8,
      name: 'THC Plus App',
      type: 'App' as const,
      industry: 'Retail',
      package: 'Industry App',
      result: 'Full-featured hemp retail management app with real-time inventory, compliance tracking, age verification, and POS integration — built specifically for the hemp industry',
      demoUrl: 'https://thcplusapp.vercel.app',
      services: [
        'Real-time inventory management',
        'Compliance & age verification',
        'POS system integration',
        'Customer loyalty program',
        'Sales analytics dashboard',
        'Multi-location support',
      ],
    },
    {
      id: 9,
      name: 'Houston Fine Jewelers',
      type: 'Website' as const,
      industry: 'Retail',
      package: 'Growth Package',
      demoUrl: 'https://premier-jewelry.vercel.app',
      result: 'Elegant custom website for a jewelry retailer — showcasing collections with high-end design, product galleries, and seamless mobile experience',
      services: [
        'Custom luxury design',
        'Product collection galleries',
        'Mobile-responsive layout',
        'Contact form with inquiry routing',
        'SEO optimization for local search',
        'Google Analytics 4 setup',
      ],
    },
    {
      id: 10,
      name: 'Golden Orchid Thai',
      type: 'Website' as const,
      industry: 'Restaurants',
      package: 'Starter Package',
      demoUrl: 'https://thai-way-6.vercel.app',
      result: 'Clean, appetizing restaurant website with full menu, location info, and online presence that captures the authentic Thai dining experience',
      services: [
        '5-page responsive website',
        'Full menu with categories',
        'Photo gallery',
        'Google Maps integration',
        'Mobile-first design',
        'Contact form with hours display',
      ],
    },
    {
      id: 11,
      name: 'Studio Bliss Salon',
      type: 'Website' as const,
      industry: 'Beauty',
      package: 'Starter Package',
      demoUrl: 'https://perfect-cuts.vercel.app',
      result: 'Professional salon website with service menu, online booking integration, and a design that reflects the personal brand and expertise',
      services: [
        '5-page responsive website',
        'Service menu with pricing',
        'Online booking integration',
        'Before/after style gallery',
        'Mobile-first design',
        'Local SEO optimization',
      ],
    },
    {
      id: 1,
      name: 'Reliable Plumbing Co.',
      type: 'Website' as const,
      industry: 'Home Services',
      package: 'Starter Package',
      highlight: 'Page 1 on Google in 60 days',
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
      type: 'Website' as const,
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
      type: 'Website' as const,
      industry: 'Home Services',
      package: 'Growth Package',
      highlight: 'Built & live in 18 days',
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
      type: 'Website' as const,
      industry: 'Med Spas',
      package: 'Enterprise Package',
      highlight: 'Luxury design + booking system',
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
      type: 'Website' as const,
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
      type: 'Website' as const,
      industry: 'Restaurants',
      package: 'Growth Package',
      highlight: 'Full online ordering system',
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
      type: 'Website' as const,
      industry: 'Restaurants',
      package: 'Enterprise Package',
      highlight: 'AI chatbot + loyalty rewards',
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

  const filters = ['All', 'Websites', 'Apps', 'Home Services', 'Med Spas', 'Restaurants', 'Retail', 'Beauty']

  const filteredProjects = activeFilter === 'All'
    ? projects
    : activeFilter === 'Websites'
    ? projects.filter((p) => p.type === 'Website')
    : activeFilter === 'Apps'
    ? projects.filter((p) => p.type === 'App')
    : projects.filter((p) => p.industry === activeFilter)

  return (
    <section className="section bg-gray-bg">
      <div className="container">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${
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
