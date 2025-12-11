import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { AnimatedPage } from '../components/AnimatedPage'

export function NotFound() {
  return (
    <AnimatedPage>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl w-full"
      >
        <Card className="space-y-6">
          {/* 404 Illustration */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
          >
            404
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/">
              <Button size="lg" className="gap-2">
                <Home className="w-5 h-5" />
                Go Home
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </Button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Quick links:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link
                to="/dashboard"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Dashboard
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                to="/send"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Send Money
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                to="/transactions"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Transactions
              </Link>
            </div>
          </motion.div>
        </Card>
      </motion.div>
      </div>
    </AnimatedPage>
  )
}
