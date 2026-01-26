import { createBrowserRouter, RouteObject } from 'react-router-dom'
import { RootLayout } from '@/components/layout'
import { ProtectedRoute } from './ProtectedRoute'

// Pages
import { HomePage } from '@/pages/home'
import { DashboardPage } from '@/pages/dashboard'
import { SendPage } from '@/pages/send'
import { RemittanceDetailPage } from '@/pages/remittance'
import { TransactionsPage } from '@/pages/transactions'
import { NotFoundPage } from '@/pages/NotFoundPage'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'send',
        element: (
          <ProtectedRoute>
            <SendPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'remittance/:id',
        element: <RemittanceDetailPage />,
      },
      {
        path: 'transactions',
        element: (
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
