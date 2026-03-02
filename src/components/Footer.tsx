import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy text-white py-16">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-baseline gap-1.5 mb-4">
              <span className="text-2xl font-extrabold tracking-tight font-display">Pegrio</span>
              <span className="text-xs font-medium text-blue-light tracking-wide uppercase">Web Development</span>
            </div>
            <p className="text-gray-400 text-sm mb-3">
              Custom websites and industry apps for local businesses.
            </p>
            <p className="text-gray-500 text-xs">
              Houston, TX — Serving clients nationwide
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Services</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/websites" className="text-gray-400 hover:text-white transition-colors text-sm">
                Website Design
              </Link>
              <Link href="/apps" className="text-gray-400 hover:text-white transition-colors text-sm">
                Industry Apps
              </Link>
              <Link href="/websites#maintenance" className="text-gray-400 hover:text-white transition-colors text-sm">
                Maintenance Plans
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Company</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/work" className="text-gray-400 hover:text-white transition-colors text-sm">
                Portfolio
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                About
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                Contact
              </Link>
              <Link href="/order" className="text-gray-400 hover:text-white transition-colors text-sm">
                Order
              </Link>
            </div>
          </div>

          {/* Mini CTA */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Ready to start?</h4>
            <p className="text-gray-400 text-sm mb-4">
              Get a free audit of your current website and find out what&apos;s costing you customers.
            </p>
            <Link
              href="/contact"
              className="btn-primary text-sm px-5 py-2.5"
            >
              Get Free Audit
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {currentYear} Pegrio LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-gray-600 text-xs font-mono">
              Built with Next.js + Tailwind CSS
            </span>
            <Link href="/admin/login" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
