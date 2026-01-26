import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useTheme } from '@/providers/ThemeProvider'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/send', label: 'Send' },
  { to: '/transactions', label: 'Transactions' },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500">
            <span className="text-lg font-bold text-white">R</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            RemitEasy
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="hidden rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 sm:block"
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Wallet Connect */}
          <div className="hidden sm:block">
            <ConnectButton
              chainStatus="icon"
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 md:hidden">
          <nav className="flex flex-col p-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-3 text-base font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                {resolvedTheme === 'dark' ? (
                  <>
                    <Sun className="h-5 w-5" /> Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5" /> Dark Mode
                  </>
                )}
              </button>
            </div>
            <div className="mt-4">
              <ConnectButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
