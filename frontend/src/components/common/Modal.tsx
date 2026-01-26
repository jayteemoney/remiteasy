import { ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  overlayClassName?: string
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
}

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  overlayClassName,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!closeOnEscape) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, closeOnEscape])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && contentRef.current) {
      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      firstElement?.focus()
    }
  }, [isOpen])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === overlayRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-black/50 backdrop-blur-sm',
        'animate-[fade-in_0.15s_ease-out]',
        overlayClassName
      )}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={contentRef}
        className={cn(
          'relative w-full max-w-md rounded-xl bg-white shadow-xl',
          'dark:bg-gray-900',
          'animate-[slide-up_0.2s_ease-out]',
          className
        )}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  )
}

interface ModalHeaderProps {
  children: ReactNode
  className?: string
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
  return (
    <div className={cn('border-b border-gray-200 px-6 py-4 dark:border-gray-800', className)}>
      {children}
    </div>
  )
}

interface ModalTitleProps {
  children: ReactNode
  className?: string
}

export function ModalTitle({ children, className }: ModalTitleProps) {
  return (
    <h2 className={cn('text-lg font-semibold text-gray-900 dark:text-gray-100', className)}>
      {children}
    </h2>
  )
}

interface ModalBodyProps {
  children: ReactNode
  className?: string
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return <div className={cn('p-6', className)}>{children}</div>
}

interface ModalFooterProps {
  children: ReactNode
  className?: string
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-800',
        className
      )}
    >
      {children}
    </div>
  )
}
