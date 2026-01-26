import { RouterProvider } from 'react-router-dom'
import { Web3Provider, ThemeProvider, ToastProvider } from '@/providers'
import { ErrorBoundary } from '@/components/common'
import { router } from '@/router'

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Web3Provider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </Web3Provider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
