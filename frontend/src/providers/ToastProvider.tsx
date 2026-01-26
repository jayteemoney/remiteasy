import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: 'var(--toast-bg, #ffffff)',
            color: 'var(--toast-color, #1f2937)',
            border: '1px solid var(--toast-border, #e5e7eb)',
            borderRadius: '0.75rem',
            padding: '0.875rem 1rem',
            fontSize: '0.875rem',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#35d07f',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
            duration: 6000,
          },
          loading: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </>
  )
}
