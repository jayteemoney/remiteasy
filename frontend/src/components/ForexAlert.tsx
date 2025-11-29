import { useEffect, useState, useRef } from 'react'
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useGetCurrentPrice } from '../hooks/useRemitEscrow'

/**
 * ForexAlert Component
 * Monitors cUSD/USD exchange rate via Chainlink and alerts users of favorable rate changes
 * Shows real-time price and notifies when rate improves by >2%
 */
export function ForexAlert() {
  const { data: currentPriceRaw, isLoading } = useGetCurrentPrice()
  const [priceHistory, setPriceHistory] = useState<number[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const lastAlertTime = useRef<number>(0)
  const hasShownInitialPrice = useRef(false)

  // Convert Chainlink price (8 decimals) to readable format
  const currentPrice = currentPriceRaw ? Number(currentPriceRaw) / 1e8 : 1.0

  // Update price history
  useEffect(() => {
    if (currentPrice && currentPrice !== 1.0) {
      setPriceHistory((prev) => {
        const updated = [...prev, currentPrice]
        // Keep only last 10 prices
        return updated.slice(-10)
      })

      // Show initial price (only once)
      if (!hasShownInitialPrice.current) {
        hasShownInitialPrice.current = true
        toast.success(`Current cUSD rate: $${currentPrice.toFixed(4)}`, {
          icon: '💱',
          duration: 3000,
        })
      }
    }
  }, [currentPrice])

  // Check for favorable rate changes
  useEffect(() => {
    if (priceHistory.length < 2) return

    const previousPrice = priceHistory[priceHistory.length - 2]
    const changePercent = ((currentPrice - previousPrice) / previousPrice) * 100

    // Alert if price improved by >2% and enough time has passed since last alert (5 minutes)
    const now = Date.now()
    const timeSinceLastAlert = now - lastAlertTime.current
    const fiveMinutes = 5 * 60 * 1000

    if (changePercent > 2 && timeSinceLastAlert > fiveMinutes) {
      setShowAlert(true)
      lastAlertTime.current = now

      toast.success(
        `Great news! cUSD rate improved by ${changePercent.toFixed(2)}%! Send now to save more.`,
        {
          icon: '📈',
          duration: 6000,
        }
      )

      // Auto-hide alert after 10 seconds
      setTimeout(() => setShowAlert(false), 10000)
    }
  }, [currentPrice, priceHistory])

  // Calculate price trend
  const getTrend = () => {
    if (priceHistory.length < 2) return 'neutral'
    const previousPrice = priceHistory[priceHistory.length - 2]
    if (currentPrice > previousPrice) return 'up'
    if (currentPrice < previousPrice) return 'down'
    return 'neutral'
  }

  const trend = getTrend()

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Price Display Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <span className="text-lg">💱</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">cUSD/USD Rate</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  ${currentPrice.toFixed(4)}
                </p>
                {trend === 'up' && (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                )}
                {trend === 'down' && (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Live via Chainlink</p>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600 dark:text-green-400">Active</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Favorable Rate Alert Banner */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-4 overflow-hidden"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-1">
                  Favorable Exchange Rate!
                </h4>
                <p className="text-white/90 text-sm">
                  The cUSD/USD rate has improved by more than 2%. This is a great time to
                  send remittances and maximize value!
                </p>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
                aria-label="Close alert"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
