import { ReactNode } from 'react'
import { Navigation } from './Navigation'
import { ScrollToTop } from './ScrollToTop'
import { ExternalLink } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  RemitEasy
                </span>
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Pool funds with friends and family for cross-border remittances.
                Secure, transparent, and low-cost.
              </p>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://docs.celo.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors inline-flex items-center gap-1"
                  >
                    Celo Documentation
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://sepolia.celoscan.io/address/0x6F491FaBdEc72fD14e9E014f50B2ffF61C508bf1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors inline-flex items-center gap-1"
                  >
                    Smart Contract
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Built with */}
            <div>
              <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">
                Built with
              </h4>
              <div className="flex flex-wrap gap-2">
                {['React', 'Vite', 'Tailwind', 'Celo', 'MiniPay'].map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center">
              Celo MiniPay Hackathon 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
