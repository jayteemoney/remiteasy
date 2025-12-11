import { Component, ReactNode } from 'react'
import { useNavigate, NavigateFunction } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

interface Props {
  children: ReactNode
  navigate?: NavigateFunction
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    if (this.props.navigate) {
      this.props.navigate('/')
    } else {
      window.location.href = '/'
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full"
          >
            <Card className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Something went wrong
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  We're sorry, but something unexpected happened. Please try refreshing
                  the page.
                </p>
              </div>

              {this.state.error && (
                <details className="text-left">
                  <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                    Technical details
                  </summary>
                  <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg text-xs overflow-auto text-red-600 dark:text-red-400">
                    {this.state.error.toString()}
                    {this.state.error.stack && `\n${this.state.error.stack}`}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button onClick={this.handleReset} size="lg" className="gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Return to Home
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Refresh Page
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * ErrorBoundary Wrapper
 * Provides React Router navigation to the class component
 */
export function ErrorBoundary({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  return <ErrorBoundaryClass navigate={navigate}>{children}</ErrorBoundaryClass>
}
