/**
 * Application Configuration Constants
 * Centralized configuration for polling intervals, timeouts, and other app-wide settings
 */

// Blockchain Data Polling Intervals (in milliseconds)
export const POLLING_INTERVALS = {
  // Individual remittance data - poll less frequently as they change less often
  REMITTANCE_DETAILS: 15000, // 15 seconds

  // User's list of remittances - moderate polling
  USER_REMITTANCES: 20000, // 20 seconds

  // Recipient remittances - moderate polling
  RECIPIENT_REMITTANCES: 20000, // 20 seconds

  // Contribution data - poll more frequently for active contributions
  CONTRIBUTIONS: 10000, // 10 seconds

  // Forex price data - can be more frequent
  FOREX_PRICE: 30000, // 30 seconds
} as const

// Transaction Timeouts
export const TRANSACTION_TIMEOUTS = {
  // Wait for transaction receipt timeout
  RECEIPT_WAIT: 120000, // 2 minutes

  // Form submission timeout
  FORM_SUBMIT: 180000, // 3 minutes
} as const

// Debounce Delays
export const DEBOUNCE_DELAYS = {
  // localStorage writes
  LOCAL_STORAGE: 500, // 500ms

  // Search input
  SEARCH_INPUT: 300, // 300ms

  // Forex alert display
  FOREX_ALERT: 300000, // 5 minutes
} as const

// Validation Constants
export const VALIDATION = {
  // Minimum remittance amount in cUSD
  MIN_REMITTANCE_AMOUNT: 1, // 1 cUSD

  // Maximum remittance amount in cUSD
  MAX_REMITTANCE_AMOUNT: 1000000, // 1M cUSD

  // Decimal precision for amounts
  AMOUNT_DECIMALS: 18, // Celo uses 18 decimals

  // Maximum purpose length
  MAX_PURPOSE_LENGTH: 200,
} as const

// UI Constants
export const UI = {
  // Toast notification duration
  TOAST_DURATION: 4000, // 4 seconds

  // Success toast duration
  TOAST_SUCCESS_DURATION: 3000, // 3 seconds

  // Error toast duration
  TOAST_ERROR_DURATION: 5000, // 5 seconds

  // Page transition duration
  PAGE_TRANSITION_DURATION: 400, // 400ms

  // Skeleton loading minimum display time
  SKELETON_MIN_DISPLAY: 500, // 500ms
} as const

// Feature Flags (for conditional features)
export const FEATURES = {
  // Enable phone number support
  PHONE_NUMBER_SUPPORT: true,

  // Enable forex alerts
  FOREX_ALERTS: true,

  // Enable analytics
  ANALYTICS: false,
} as const
