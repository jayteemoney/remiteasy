import { useState, useCallback, useRef, useEffect } from 'react'

interface UseCopyToClipboardResult {
  copied: boolean
  copy: (text: string) => Promise<boolean>
}

export function useCopyToClipboard(resetDelay = 2000): UseCopyToClipboardResult {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return false
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)

      timeoutRef.current = setTimeout(() => {
        setCopied(false)
      }, resetDelay)

      return true
    } catch (error) {
      console.error('Failed to copy:', error)
      setCopied(false)
      return false
    }
  }, [resetDelay])

  return { copied, copy }
}
