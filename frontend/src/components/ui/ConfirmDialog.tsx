import { Modal } from './Modal'
import { Button } from './Button'
import { AlertCircle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary'
  isLoading?: boolean
}

/**
 * ConfirmDialog Component
 * A reusable confirmation dialog that replaces window.confirm with a better UX
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="space-y-4">
        {/* Icon */}
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto ${
            variant === 'danger'
              ? 'bg-red-100 dark:bg-red-900/20'
              : 'bg-blue-100 dark:bg-blue-900/20'
          }`}
        >
          <AlertCircle
            className={`w-6 h-6 ${
              variant === 'danger'
                ? 'text-red-600 dark:text-red-400'
                : 'text-blue-600 dark:text-blue-400'
            }`}
          />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white">
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            fullWidth
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={handleConfirm}
            fullWidth
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
