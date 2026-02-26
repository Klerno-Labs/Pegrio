'use client'

import Link from 'next/link'

export default function MaintenancePlans() {
  const plans = [
    {
      name: 'Basic',
      price: '$97/mo',
      features: [
        'Hosting',
        'Security updates',
        'Uptime monitoring',
        '1 content edit per month',
      ],
    },
    {
      name: 'Standard',
      price: '$197/mo',
      features: [
        'Everything in Basic',
        '3 edits per month',
        'Monthly performance report',
        'Google Business Profile updates',
      ],
    },
    {
      name: 'Premium',
      price: '$497/mo',
      features: [
        'Everything in Standard',
        'Unlimited edits',
        'Monthly SEO updates',
        '1 blog post written and published',
        'Quarterly strategy review call',
      ],
    },
  ]

  return (
    <section className="section bg-white">
      <div className="container">
        <h2 className="text-center mb-4">Keep Your Site Performing Month After Month</h2>
        <p className="text-center text-gray-muted mb-12 max-w-2xl mx-auto">
          Optional monthly maintenance and growth plans to keep your site secure, updated, and generating leads
        </p>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left pb-4 pr-4 text-gray-muted font-semibold">Feature</th>
                {plans.map((plan) => (
                  <th key={plan.name} className="text-center pb-4 px-4">
                    <div className="font-bold text-xl text-navy">{plan.name}</div>
                    <div className="text-2xl font-bold text-blue-accent mt-2">{plan.price}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-4 pr-4">Hosting & Security</td>
                {plans.map((plan) => (
                  <td key={plan.name} className="py-4 px-4 text-center">
                    <span className="text-blue-accent text-xl">✓</span>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 pr-4">Uptime Monitoring</td>
                {plans.map((plan) => (
                  <td key={plan.name} className="py-4 px-4 text-center">
                    <span className="text-blue-accent text-xl">✓</span>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 pr-4">Content Edits / Month</td>
                <td className="py-4 px-4 text-center">1</td>
                <td className="py-4 px-4 text-center">3</td>
                <td className="py-4 px-4 text-center">Unlimited</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 pr-4">Performance Reports</td>
                <td className="py-4 px-4 text-center text-gray-300">—</td>
                <td className="py-4 px-4 text-center">Monthly</td>
                <td className="py-4 px-4 text-center">Monthly</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 pr-4">Google Business Profile</td>
                <td className="py-4 px-4 text-center text-gray-300">—</td>
                <td className="py-4 px-4 text-center">
                  <span className="text-blue-accent text-xl">✓</span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="text-blue-accent text-xl">✓</span>
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 pr-4">SEO Updates</td>
                <td className="py-4 px-4 text-center text-gray-300">—</td>
                <td className="py-4 px-4 text-center text-gray-300">—</td>
                <td className="py-4 px-4 text-center">Monthly</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 pr-4">Blog Content</td>
                <td className="py-4 px-4 text-center text-gray-300">—</td>
                <td className="py-4 px-4 text-center text-gray-300">—</td>
                <td className="py-4 px-4 text-center">1/month</td>
              </tr>
              <tr>
                <td className="py-4 pr-4">Strategy Calls</td>
                <td className="py-4 px-4 text-center text-gray-300">—</td>
                <td className="py-4 px-4 text-center text-gray-300">—</td>
                <td className="py-4 px-4 text-center">Quarterly</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-6">
          {plans.map((plan) => (
            <div key={plan.name} className="card">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-blue-accent">{plan.price}</div>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="text-blue-accent">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-muted mb-4">
            Not sure which package fits your business?
          </p>
          <Link href="/order" className="btn-primary text-lg px-8 py-4 inline-block">
            Start Your Project
          </Link>
        </div>
      </div>
    </section>
  )
}
