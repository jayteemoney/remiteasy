import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/common'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-bold text-gray-200 dark:text-gray-800">404</div>
      <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
        Page Not Found
      </h1>
      <p className="mt-2 max-w-md text-gray-500 dark:text-gray-400">
        Sorry, we couldn't find the page you're looking for. It might have been
        moved or doesn't exist.
      </p>
      <div className="mt-8 flex gap-4">
        <Link to="/">
          <Button leftIcon={<Home className="h-4 w-4" />}>
            Go Home
          </Button>
        </Link>
        <Button
          variant="outline"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    </div>
  )
}
