import { useEffect, useState, useRef, useMemo } from 'react'
import { TrendingUp, TrendingDown, X, DollarSign } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useGetCurrentPrice } from '../hooks/useRemitEscrow'
import { Card } from './ui/Card'

export function ForexAlert() {
  const { data: currentPriceRaw, isLoading } = useGetCurrentPrice()
  const [priceHistory, setPriceHistory] = useState<number[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const lastAlertTime = useRef<number>(0)
  const hasShownInitialPrice = useRef(false)

  const currentPrice = currentPriceRaw ? Number(currentPriceRaw) / 1e8 : 1.0

  useEffect(() => {
    if (currentPrice && currentPrice !== 1.0) {
      setPriceHistory((prev) => {
        const updated = [...prev, currentPrice]
        return updated.slice(-10)
      })

      if (!hasShownInitialPrice.current) {
        hasShownInitialPrice.current = true
        toast.success(`Current cUSD rate: $${currentPrice.toFixed(4)}`, {
          duration: 3000,
        })
      }
    }
  }, [currentPrice])

  useEffect(() => {
    if (priceHistory.length < 2) return

    const previousPrice = priceHistory[priceHistory.length - 2]
    const changePercent = ((currentPrice - previousPrice) / previousPrice) * 100

    const now = Date.now()
    const timeSinceLastAlert = now - lastAlertTime.current
    const fiveMinutes = 5 * 60 * 1000

    if (changePercent > 2 && timeSinceLastAlert > fiveMinutes) {
      setShowAlert(true)
      lastAlertTime.current = now

      toast.success(
        `cUSD rate improved by ${changePercent.toFixed(2)}%!`,
        { duration: 6000 }
      )

      setTimeout(() => setShowAlert(false), 10000)
    }
  }, [currentPrice, priceHistory])

  const trend = useMemo(() => {
    if (priceHistory.length < 2) return 'neutral'
    const previousPrice = priceHistory[priceHistory.length - 2]
    if (currentPrice > previousPrice) return 'up'
    if (currentPrice < previousPrice) return 'down'
    return 'neutral'
  }, [priceHistory, currentPrice])

  if (isLoading) {
    return (
      <Card padding="sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse w-20" />
            <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse w-16" />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">cUSD/USD Rate</p>
              <div className="flex items-center gap-1.5">
                <p className="text-base font-semibold text-neutral-900 dark:text-white">
                  ${currentPrice.toFixed(4)}
                </p>
                {trend === 'up' && (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                )}
                {trend === 'down' && (
                  <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span className="text-[10px] text-neutral-400">Live</span>
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3"
          >
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    Favorable Rate
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                    cUSD/USD rate improved by more than 2%. Good time to send!
                  </p>
                </div>
                <button
                  onClick={() => setShowAlert(false)}
                  className="text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-200"
                  aria-label="Close alert"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
