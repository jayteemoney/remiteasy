import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './Button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 rounded-full bg-red-100 p-4 dark:bg-red-900/30">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Something went wrong
          </h2>
          <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
            An unexpected error occurred. Please try refreshing the page or contact support if the
            problem persists.
          </p>
          {this.state.error && (
            <pre className="mt-4 max-w-md overflow-auto rounded-lg bg-gray-100 p-3 text-left text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {this.state.error.message}
            </pre>
          )}
          <div className="mt-6 flex gap-3">
            <Button onClick={this.handleReset} variant="outline" leftIcon={<RefreshCw className="h-4 w-4" />}>
              Try Again
            </Button>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
