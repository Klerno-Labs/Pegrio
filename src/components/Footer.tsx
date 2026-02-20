import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Logo and Tagline */}
          <div>
            <div className="flex items-baseline gap-1.5 mb-4">
              <span className="text-2xl font-extrabold tracking-tight">Pegrio</span>
              <span className="text-xs font-medium text-purple-light tracking-wide uppercase">Web Development</span>
            </div>
            <p className="text-gray-300 max-w-md">
              High-performance websites for local businesses — Houston, Katy, and nationwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                Services
              </Link>
              <Link href="/work" className="text-gray-300 hover:text-white transition-colors">
                Work
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-gray-400 text-sm">
            © {currentYear} Pegrio LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
