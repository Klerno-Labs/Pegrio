'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/c-hatfield309/30min'
      })
    }
  }

  const navLinks = [
    { href: '/websites', label: 'Websites' },
    { href: '/apps', label: 'Apps', isNew: true },
    { href: '/work', label: 'Work' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-md'
          : 'bg-white'
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-navy tracking-tight font-display">Pegrio</span>
            <span className="hidden sm:inline text-xs font-medium text-blue-accent tracking-wide uppercase">Web Development</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-gray-text hover:text-blue-accent transition-colors font-medium"
              >
                <span className="flex items-center gap-1.5">
                  {link.label}
                  {link.isNew && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gold-premium text-white animate-pulse">
                      New
                    </span>
                  )}
                </span>
                {/* Active indicator */}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-accent"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            ))}
            <button
              onClick={openCalendly}
              className="btn-primary"
            >
              Book Free Audit
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu — Full-screen overlay with staggered links */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t"
            >
              <div className="py-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`block py-3 font-medium transition-colors ${
                        pathname === link.href
                          ? 'text-blue-accent'
                          : 'text-gray-text hover:text-blue-accent'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        {link.label}
                        {link.isNew && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gold-premium text-white">
                            New
                          </span>
                        )}
                        {pathname === link.href && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-accent" />
                        )}
                      </span>
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                >
                  <button
                    onClick={() => {
                      openCalendly()
                      setIsMobileMenuOpen(false)
                    }}
                    className="btn-primary w-full mt-4"
                  >
                    Book Free Audit
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
