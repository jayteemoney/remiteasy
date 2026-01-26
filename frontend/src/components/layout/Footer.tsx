import { Link } from 'react-router-dom'
import { ExternalLink, Github, Twitter } from 'lucide-react'
import { formatAddress } from '@/lib/format'

const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS || '0x6F491FaBdEc72fD14e9E014f50B2ffF61C508bf1') as `0x${string}`
const EXPLORER_URL = 'https://alfajores.celoscan.io/address/'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
                <span className="text-lg font-bold text-white">R</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                RemitEasy
              </span>
            </Link>
            <p className="mt-3 max-w-md text-sm text-gray-500 dark:text-gray-400">
              A decentralized group remittance platform built on Celo blockchain.
              Send money home together with family and friends, securely and transparently.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <a
                href="https://github.com/jayteemoney/remiteasy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm text-gray-500 transition-colors hover:text-primary-500 dark:text-gray-400"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/send"
                  className="text-sm text-gray-500 transition-colors hover:text-primary-500 dark:text-gray-400"
                >
                  Send Money
                </Link>
              </li>
              <li>
                <Link
                  to="/transactions"
                  className="text-sm text-gray-500 transition-colors hover:text-primary-500 dark:text-gray-400"
                >
                  Transactions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contract Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Smart Contract
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`${EXPLORER_URL}${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-primary-500 dark:text-gray-400"
                >
                  {formatAddress(CONTRACT_ADDRESS, 6)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li className="text-sm text-gray-500 dark:text-gray-400">
                Network: Celo Alfajores
              </li>
              <li>
                <a
                  href="https://docs.celo.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-primary-500 dark:text-gray-400"
                >
                  Celo Documentation
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} RemitEasy. Built with love on Celo.
          </p>
        </div>
      </div>
    </footer>
  )
}
