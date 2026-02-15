'use client'

import { useState } from 'react'
import ContactModal from '../components/ContactModal'

const packages = [
  {
    id: 'essential',
    name: 'ESSENTIAL',
    icon: '🥉',
    price: 2000,
    tagline: 'Perfect for new restaurants getting online',
    deliveryTime: '1-2 weeks',
    features: [
      { id: 'e1', text: '✅ 5 Pages (Home, Menu, About, Gallery, Contact)' },
      { id: 'e2', text: '✅ Mobile-responsive design' },
      { id: 'e3', text: '✅ Professional template (3 styles to choose from)' },
      { id: 'e4', text: '✅ Menu display (no online ordering)' },
      { id: 'e5', text: '✅ Contact form' },
      { id: 'e6', text: '✅ Google Maps integration' },
      { id: 'e7', text: '✅ Social media links' },
      { id: 'e8', text: '✅ Basic SEO setup' },
      { id: 'e9', text: '✅ 2 rounds of revisions' },
      { id: 'e10', text: '✅ 30-day support' },
    ],
    bestFor: 'Small restaurants, new businesses, tight budgets',
    isPopular: false,
  },
  {
    id: 'professional',
    name: 'PROFESSIONAL',
    icon: '🥈',
    price: 5000,
    tagline: 'Complete online presence with ordering',
    deliveryTime: '2-3 weeks',
    includesEssential: true,
    features: [
      { id: 'p1', text: '✅ 8 Pages (+Cart, Checkout, Order Confirmation)' },
      { id: 'p2', text: '✅ Online ordering system (pickup/delivery)' },
      { id: 'p3', text: '✅ Custom design (tailored to your brand)' },
      { id: 'p4', text: '✅ Custom logo design (3 concepts)' },
      { id: 'p5', text: '✅ Advanced menu (categories, filters, search)' },
      { id: 'p6', text: '✅ Google Reviews display' },
      { id: 'p7', text: '✅ Instagram feed integration' },
      { id: 'p8', text: '✅ Enhanced SEO' },
      { id: 'p9', text: '✅ Performance optimization' },
      { id: 'p10', text: '✅ Security implementation' },
      { id: 'p11', text: '✅ 4 rounds of revisions' },
      { id: 'p12', text: '✅ 60-day support' },
      { id: 'p13', text: '✅ Training session' },
    ],
    bestFor: 'Established restaurants, mid-sized businesses, growth-focused',
    isPopular: true,
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    icon: '🥇',
    price: 8000,
    tagline: 'Enterprise solution for serious growth',
    deliveryTime: '3-4 weeks',
    includesEssential: true,
    features: [
      { id: 'pr1', text: '✅ Square payment integration (live processing)' },
      { id: 'pr2', text: '✅ User accounts (customer profiles, order history)' },
      { id: 'pr3', text: '✅ Advanced security (rate limiting, CSP, monitoring)' },
      { id: 'pr4', text: '✅ Email marketing (order confirmations, promotions)' },
      { id: 'pr5', text: '✅ Analytics dashboard (track orders, revenue, customers)' },
      { id: 'pr6', text: '✅ Advanced branding (full brand guide, multiple logo variations)' },
      { id: 'pr7', text: '✅ Loyalty program (points, rewards)' },
      { id: 'pr8', text: '✅ Multi-location support (if needed)' },
      { id: 'pr9', text: '✅ Premium performance (Lighthouse 95+ score)' },
      { id: 'pr10', text: '✅ Unlimited revisions' },
      { id: 'pr11', text: '✅ 90-day priority support' },
      { id: 'pr12', text: '✅ 2-hour training session' },
      { id: 'pr13', text: '✅ Monthly optimization (first 3 months)' },
    ],
    bestFor: 'Successful restaurants, chains, premium establishments',
    isPopular: false,
  },
]

const addons = [
  { id: 'addon1', icon: '🤖', name: 'AI Chatbot & Agent', price: '+$3,500', description: '24/7 AI-powered customer service chatbot for orders, reservations, and FAQ', featured: true },
  { id: 'addon2', icon: '📸', name: 'Photography Session', price: '+$1,500', description: 'Professional food photography for your menu and website' },
  { id: 'addon3', icon: '✍️', name: 'Content Writing', price: '+$800', description: 'Professional copywriting for all pages and menu descriptions' },
  { id: 'addon4', icon: '🔧', name: 'Monthly Maintenance', price: '$200/month', description: 'Updates, backups, security, and technical support' },
  { id: 'addon5', icon: '🚀', name: 'SEO Package', price: '+$2,000', description: 'Advanced SEO optimization and local search setup' },
  { id: 'addon6', icon: '💬', name: 'SMS Marketing', price: '+$1,200', description: 'Automated SMS campaigns for promotions and order updates' },
]

const testimonials = [
  {
    id: 'test1',
    name: 'Maria Rodriguez',
    restaurant: 'Casa de Tacos',
    image: '🌮',
    rating: 5,
    text: 'We went from zero online presence to 50+ orders per day in just 3 weeks! The Professional package was perfect for our needs.',
    package: 'Professional',
  },
  {
    id: 'test2',
    name: 'David Chen',
    restaurant: 'Golden Dragon',
    image: '🍜',
    rating: 5,
    text: 'The Premium package transformed our business. Customer accounts and loyalty program increased repeat orders by 40%!',
    package: 'Premium',
  },
  {
    id: 'test3',
    name: 'Sarah Johnson',
    restaurant: 'Bella Italia',
    image: '🍝',
    rating: 5,
    text: 'Best investment we made. The site looks amazing and the online ordering system is so easy for our customers to use.',
    package: 'Professional',
  },
]

const processSteps = [
  {
    id: 'step1',
    step: 1,
    title: 'Discovery Call',
    duration: '30 minutes',
    description: 'We discuss your restaurant, brand, goals, and choose the right package for you.',
    icon: '📞',
  },
  {
    id: 'step2',
    step: 2,
    title: 'Design & Content',
    duration: '3-5 days',
    description: 'Gather your menu, photos, and branding. We create mockups for your approval.',
    icon: '🎨',
  },
  {
    id: 'step3',
    step: 3,
    title: 'Development',
    duration: '1-2 weeks',
    description: 'We build your site with all features, optimized for speed and conversions.',
    icon: '💻',
  },
  {
    id: 'step4',
    step: 4,
    title: 'Review & Revisions',
    duration: '2-3 days',
    description: 'You review everything and we make any needed adjustments.',
    icon: '✏️',
  },
  {
    id: 'step5',
    step: 5,
    title: 'Launch & Training',
    duration: '1 day',
    description: 'We launch your site and train you on managing orders and content.',
    icon: '🚀',
  },
]

const faqs = [
  {
    id: 'faq1',
    question: 'How long does it take to get my website?',
    answer: 'Delivery time depends on your package: Essential (1-2 weeks), Professional (2-3 weeks), Premium (3-4 weeks). Timeline starts after we receive all your content (menu, photos, text).',
  },
  {
    id: 'faq2',
    question: 'What if I don\'t have professional photos?',
    answer: 'No problem! You can add our Photography Session add-on (+$1,500) for professional food photography, or we can work with your existing photos and stock images.',
  },
  {
    id: 'faq3',
    question: 'Can I update the menu myself after launch?',
    answer: 'Yes! All packages include training on how to update your menu, prices, and content. It\'s easy - no technical skills required.',
  },
  {
    id: 'faq4',
    question: 'Do you provide hosting?',
    answer: 'Yes, hosting is included for the first year. After that, it\'s $20/month or you can host it yourself.',
  },
  {
    id: 'faq5',
    question: 'What payment methods do you accept?',
    answer: 'We accept credit cards, bank transfers, and offer flexible payment plans: pay in full (5% discount), 50/50 split, or monthly payments.',
  },
  {
    id: 'faq6',
    question: 'Can I upgrade my package later?',
    answer: 'Absolutely! You can upgrade at any time. We\'ll credit what you\'ve already paid toward the higher tier.',
  },
  {
    id: 'faq7',
    question: 'Do you integrate with my existing POS system?',
    answer: 'The Premium package includes integrations with popular POS systems like Square, Toast, and Clover. Contact us for specific integration questions.',
  },
  {
    id: 'faq8',
    question: 'What happens after my support period ends?',
    answer: 'You can continue with our Monthly Maintenance package ($200/month) for ongoing updates, or handle updates yourself. We\'re always here if you need help!',
  },
]

const stats = [
  { id: 'stat1', number: '200+', label: 'Restaurants Launched' },
  { id: 'stat2', number: '95%', label: 'Client Satisfaction' },
  { id: 'stat3', number: '2-4 weeks', label: 'Average Delivery' },
  { id: 'stat4', number: '40%', label: 'Avg. Order Increase' },
]

export default function Home() {
  const [selectedPackage, setSelectedPackage] = useState<typeof packages[0] | null>(null)
  const [openFaq, setOpenFaq] = useState<string | null>(null)

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEg0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

        <div className="section-container relative z-10 py-20 lg:py-32 text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold animate-fade-in">
            🚀 Launch Your Restaurant Online in 2-4 Weeks
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight animate-slide-up">
            Restaurant Websites That <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Drive Orders</span>
          </h1>

          <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-3xl mx-auto leading-relaxed">
            Choose your package and get online in 2-4 weeks. No custom quotes, no surprises.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="#packages" className="btn btn-primary shadow-2xl hover:shadow-yellow-400/20">
              View Packages
            </a>
            <a href="#demos" className="btn btn-secondary">
              See Live Demos
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center transform hover:scale-105 transition-transform">
                <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2">{stat.number}</div>
                <div className="text-sm md:text-base opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="section-container">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-center mb-4">Choose Your Package</h2>
          <p className="text-xl text-gray-600 text-center mb-16">Clear pricing. Clear deliverables. No surprises.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`pricing-card relative overflow-hidden ${
                  pkg.isPopular ? 'ring-4 ring-primary-500 lg:scale-105' : ''
                }`}
              >
                {pkg.isPopular && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-2 font-bold text-sm">
                    ⭐ Most Popular
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{pkg.icon}</div>
                    <h3 className="text-2xl font-bold mb-2 tracking-tight">{pkg.name}</h3>
                    <div className="text-5xl font-extrabold text-primary-600 mb-2">
                      ${pkg.price.toLocaleString()}
                    </div>
                    <p className="text-gray-600">{pkg.tagline}</p>
                  </div>

                  <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg px-4 py-3 mb-6">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 16 16" aria-label="Clock icon">
                      <title>Delivery time</title>
                      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">Delivery: {pkg.deliveryTime}</span>
                  </div>

                  {pkg.includesEssential && (
                    <p className="font-bold mb-3 text-primary-700">Everything in Essential, PLUS:</p>
                  )}

                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature) => (
                      <li key={feature.id} className="text-sm text-gray-700 py-2 border-b border-gray-100 last:border-0">
                        {feature.text}
                      </li>
                    ))}
                  </ul>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                    <p className="text-sm"><strong>Best For:</strong> {pkg.bestFor}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPackage(pkg)}
                    className={`w-full ${pkg.isPopular ? 'btn btn-primary' : 'btn btn-outline'}`}
                  >
                    Get Started
                  </button>
                  <a href="#demos" className="block text-center text-primary-600 font-semibold mt-3 hover:text-primary-700 transition-colors">
                    View Demo Site →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Options */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-8">Flexible Payment Options</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="transform hover:scale-105 transition-transform">
                <div className="text-5xl mb-4">💳</div>
                <h4 className="font-bold text-lg mb-2">Pay in Full</h4>
                <p className="text-gray-600">5% discount when you pay upfront</p>
              </div>
              <div className="transform hover:scale-105 transition-transform">
                <div className="text-5xl mb-4">📊</div>
                <h4 className="font-bold text-lg mb-2">50/50 Split</h4>
                <p className="text-gray-600">50% down, 50% at launch</p>
              </div>
              <div className="transform hover:scale-105 transition-transform">
                <div className="text-5xl mb-4">📅</div>
                <h4 className="font-bold text-lg mb-2">Monthly Plan</h4>
                <p className="text-gray-600">Available for Professional & Premium</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 lg:py-32 bg-white">
        <div className="section-container">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-center mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 text-center mb-16">From kickoff to launch in 5 simple steps</p>

          <div className="max-w-4xl mx-auto">
            {processSteps.map((step, idx) => (
              <div key={step.id} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg transform hover:scale-110 transition-transform">
                    {step.step}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                        <p className="text-sm text-primary-600 font-semibold">{step.duration}</p>
                      </div>
                      <div className="text-3xl">{step.icon}</div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{step.description}</p>
                  </div>
                  {idx < processSteps.length - 1 && (
                    <div className="w-0.5 h-8 bg-gradient-to-b from-primary-300 to-purple-300 ml-8 my-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="section-container">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-center mb-4">What Our Clients Say</h2>
          <p className="text-xl text-gray-600 text-center mb-16">Join 200+ successful restaurants</p>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{testimonial.image}</div>
                  <div>
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.restaurant}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={`${testimonial.id}-star-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-label="Star rating">
                      <title>Rating star</title>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-700 mb-4 italic leading-relaxed">"{testimonial.text}"</p>

                <div className="inline-block px-3 py-1 bg-gradient-to-r from-primary-100 to-purple-100 text-primary-700 rounded-full text-sm font-semibold">
                  {testimonial.package} Package
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-Ons Section */}
      <section id="addons" className="py-20 lg:py-32 bg-white">
        <div className="section-container">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-center mb-4">Optional Add-Ons</h2>
          <p className="text-xl text-gray-600 text-center mb-16">Enhance your website with these optional services</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addons.map((addon) => (
              <div
                key={addon.id}
                className={`bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 text-center hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-2 ${
                  addon.featured
                    ? 'border-primary-500 ring-4 ring-primary-500/20 bg-gradient-to-br from-primary-50 to-purple-50'
                    : 'border-transparent hover:border-primary-500'
                } relative`}
              >
                {addon.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    🔥 NEW & POPULAR
                  </div>
                )}
                <div className="text-5xl mb-4">{addon.icon}</div>
                <h3 className="font-bold text-lg mb-2">{addon.name}</h3>
                <div className="text-2xl font-bold text-primary-600 mb-3">{addon.price}</div>
                <p className="text-gray-600 text-sm leading-relaxed">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Sites Section */}
      <section id="demos" className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="section-container">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-center mb-4">See Live Examples</h2>
          <p className="text-xl text-gray-600 text-center mb-16">View actual sites we've built for each tier</p>

          <div className="grid md:grid-cols-3 gap-8">
            <DemoCard tier="Essential" icon="🌮" name="The Simple Taco" description="Clean, professional 5-page site with menu display" gradient="from-orange-500 to-red-600" />
            <DemoCard tier="Professional" icon="🍜" name="Thai Way 6" description="Full-featured with online ordering and custom design" gradient="from-purple-500 to-indigo-600" isPopular />
            <DemoCard tier="Premium" icon="🍝" name="Bella Vita Italian" description="Enterprise solution with payments, accounts, and analytics" gradient="from-pink-500 to-rose-600" />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 lg:py-32 bg-white">
        <div className="section-container">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 text-center mb-16">Everything you need to know</p>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq) => (
              <div key={faq.id} className="mb-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full text-left bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 rounded-xl p-6 transition-all transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg pr-8">{faq.question}</h3>
                    <svg
                      className={`w-6 h-6 text-primary-600 flex-shrink-0 transition-transform ${
                        openFaq === faq.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-label="Expand icon"
                    >
                      <title>Toggle answer</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {openFaq === faq.id && (
                    <p className="mt-4 text-gray-700 leading-relaxed">{faq.answer}</p>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-600 via-purple-600 to-primary-700 text-white py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEg0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

        <div className="section-container text-center relative z-10">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-10 opacity-95 max-w-2xl mx-auto leading-relaxed">
            Choose a package and launch your professional restaurant website in 2-4 weeks
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#packages" className="btn btn-primary btn-large shadow-2xl">
              View Packages
            </a>
            <button
              type="button"
              onClick={() => setSelectedPackage(packages[1])}
              className="btn btn-secondary btn-large"
            >
              Schedule Free Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="section-container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Restaurant Websites</h4>
              <p className="text-gray-400 text-sm leading-relaxed">Professional websites that drive orders for restaurants.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Packages</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#packages" className="hover:text-white transition-colors">Essential</a></li>
                <li><a href="#packages" className="hover:text-white transition-colors">Professional</a></li>
                <li><a href="#packages" className="hover:text-white transition-colors">Premium</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#demos" className="hover:text-white transition-colors">Portfolio</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="mailto:support@example.com" className="hover:text-white transition-colors">support@example.com</a></li>
                <li><a href="tel:+15551234567" className="hover:text-white transition-colors">(555) 123-4567</a></li>
                <li className="pt-4">
                  <div className="flex gap-4">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Restaurant Website Solutions. All rights reserved.</p>
            <div className="flex justify-center gap-6 mt-4">
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {selectedPackage && (
        <ContactModal
          package={selectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </main>
  )
}

function DemoCard({ tier, icon, name, description, gradient, isPopular = false }: {
  tier: string
  icon: string
  name: string
  description: string
  gradient: string
  isPopular?: boolean
}) {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 ${isPopular ? 'ring-4 ring-primary-500' : ''}`}>
      <div className={`relative h-72 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        {isPopular && (
          <span className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            ⭐ Most Popular
          </span>
        )}
        <span className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900">
          {tier}
        </span>
        <div className="text-center text-white transform hover:scale-110 transition-transform">
          <span className="text-8xl block mb-3 drop-shadow-lg">{icon}</span>
          <p className="text-3xl font-bold drop-shadow-md">{name}</p>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl mb-2">{tier} Tier Example</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
        <button type="button" className={`${isPopular ? 'btn btn-primary' : 'btn btn-small btn-outline'} w-full`}>
          View Demo →
        </button>
      </div>
    </div>
  )
}
