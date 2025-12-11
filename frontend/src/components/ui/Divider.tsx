interface DividerProps {
  label?: string
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function Divider({
  label,
  orientation = 'horizontal',
  className = '',
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={`w-px bg-gray-200 dark:bg-gray-700 ${className}`}
        role="separator"
        aria-orientation="vertical"
      />
    )
  }

  if (label) {
    return (
      <div className={`flex items-center gap-4 ${className}`} role="separator">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {label}
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>
    )
  }

  return (
    <div
      className={`h-px bg-gray-200 dark:bg-gray-700 ${className}`}
      role="separator"
    />
  )
}
