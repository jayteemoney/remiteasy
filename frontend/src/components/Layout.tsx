import { ReactNode } from 'react'
import { Navigation } from './Navigation'
import { ScrollToTop } from './ScrollToTop'

interface LayoutProps {
  children: ReactNode
}

/**
 * Layout Component
 * Provides consistent layout with navigation and wallet connection
 * Dark mode is managed by ThemeContext
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built for Celo MiniPay Hackathon 2025
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <a
                href="https://docs.celo.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Celo Docs
              </a>
              <span>•</span>
              <a
                href="https://sepolia.celoscan.io/address/0x6F491FaBdEc72fD14e9E014f50B2ffF61C508bf1"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Contract
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
