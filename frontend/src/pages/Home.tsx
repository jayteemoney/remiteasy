import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, Shield, Zap, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { AnimatedPage } from '../components/AnimatedPage'

export function Home() {
  const features = [
    {
      icon: Zap,
      title: 'Ultra-Low Fees',
      description: 'Only 0.5% platform fee. Save more on every transaction.',
    },
    {
      icon: Users,
      title: 'Group Pooling',
      description: 'Multiple contributors can pool funds together seamlessly.',
    },
    {
      icon: Shield,
      title: 'Secure Escrow',
      description: 'Funds held safely on-chain with full transparency.',
    },
  ]

  return (
    <AnimatedPage>
      <div className="w-full min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 sm:py-32 lg:py-40">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-5xl mx-auto"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-10 px-5 py-2.5 bg-blue-500/10 dark:bg-blue-500/20 rounded-full border border-blue-500/20"
              >
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Powered by Celo Blockchain
                </span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 dark:text-white mb-8 leading-tight tracking-tight">
                Send Money
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Together
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600 dark:text-gray-400 mb-14 leading-relaxed max-w-4xl mx-auto">
                Pool funds with friends and family for remittances.
                <br className="hidden sm:block" />
                Low fees, powered by blockchain.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link to="/send">
                  <Button size="lg" className="group w-full sm:w-auto min-w-[200px]">
                    Start Sending
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto min-w-[200px]">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Decorative gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl -z-10 opacity-50" />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 sm:py-32 lg:py-40">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-12">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Card className="text-center h-full p-10 lg:p-12 hover:shadow-2xl transition-all duration-300">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 mb-8">
                          <Icon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-5">
                          {feature.title}
                        </h3>
                        <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 sm:py-24 lg:py-32">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
                {[
                  { value: '0.5%', label: 'Platform Fee' },
                  { value: '10k+', label: 'Users' },
                  { value: '$1M+', label: 'Volume' },
                  { value: '24/7', label: 'Support' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
                      {stat.value}
                    </div>
                    <div className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 sm:py-32 lg:py-40 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16 lg:mb-20"
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                How It Works
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Simple, secure, and transparent remittances in three easy steps
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
              {[
                {
                  step: '01',
                  title: 'Create',
                  description: 'Set up a remittance with recipient details and target amount',
                },
                {
                  step: '02',
                  title: 'Contribute',
                  description: 'Share with family and friends to pool funds together',
                },
                {
                  step: '03',
                  title: 'Send',
                  description: 'Release funds once target is met - safe and instant',
                },
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="text-center"
                >
                  <div className="text-7xl lg:text-8xl font-bold text-blue-500/10 dark:text-blue-500/20 mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 sm:py-32 lg:py-40">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 border-0 p-12 sm:p-16 lg:p-20 text-center">
                <div className="relative z-10">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                    Ready to Get Started?
                  </h2>
                  <p className="text-xl sm:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
                    Join thousands sending money the smart way
                  </p>
                  <Link to="/send">
                    <Button size="lg" variant="secondary" className="group min-w-[280px]">
                      Create Your First Remittance
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </AnimatedPage>
  )
}
