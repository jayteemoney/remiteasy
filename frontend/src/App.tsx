import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PageLoader } from './components/PageLoader'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const Send = lazy(() => import('./pages/Send').then(m => ({ default: m.Send })))
const Transactions = lazy(() => import('./pages/Transactions').then(m => ({ default: m.Transactions })))
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })))

/**
 * Main App Component
 * Sets up routing, error boundaries, and lazy loading for optimal performance
 */
function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/send" element={<Send />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
