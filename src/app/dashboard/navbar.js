'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/customers', label: 'Customers' },
    { href: '/dashboard/sites', label: 'Site Details' },
    { href: '/dashboard/inventory', label: 'Inventory' },
    { href: '/dashboard/challans', label: 'Challans' }
  ]

  const isActive = (href) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true
    if (href !== '/dashboard' && pathname.startsWith(href)) return true
    return false
  }

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50 print:hidden shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center md:hidden">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full border-2 border-brand overflow-hidden bg-white">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold tracking-tight">Swastika Ply</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:gap-x-1 items-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-brand text-white'
                    : 'text-neutral-600 hover:text-brand hover:bg-neutral-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-black hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} border-t border-neutral-100`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.href)
                  ? 'bg-brand text-white'
                  : 'text-neutral-600 hover:text-brand hover:bg-neutral-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
