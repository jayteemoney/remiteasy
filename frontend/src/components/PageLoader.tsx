import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        {/* Animated Logo */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl shadow-blue-500/30"
        >
          <Send className="w-10 h-10 text-white" />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Loading RemitEasy
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Please wait...
          </p>
        </motion.div>

        {/* Loading Dots */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
