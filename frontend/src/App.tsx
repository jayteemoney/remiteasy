import { RouterProvider } from 'react-router-dom'
import { Web3Provider, ThemeProvider, ToastProvider } from '@/providers'
import { ErrorBoundary } from '@/components/common'
import { EventListenerProvider } from '@/services/eventListeners'
import { router } from '@/router'

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Web3Provider>
          <ToastProvider>
            <EventListenerProvider>
              <RouterProvider router={router} />
            </EventListenerProvider>
          </ToastProvider>
        </Web3Provider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
