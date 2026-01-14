/**
 * Input Sanitization Utility
 * Prevents XSS and other injection attacks by sanitizing user input
 */

/**
 * Sanitizes a string by escaping HTML characters
 */
export function sanitizeString(input: string): string {
    if (!input) return ''

    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .trim()
}

/**
 * Validates and sanitizes the purpose field
 * Limits length and removes potentially dangerous characters
 */
export function sanitizePurpose(purpose: string): string {
    const sanitized = sanitizeString(purpose)
    // Limit to 200 characters as per config
    return sanitized.slice(0, 200)
}

/**
 * Validates an Ethereum address format
 */
export function isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
}
