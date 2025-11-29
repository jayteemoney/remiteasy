import { isAddress } from 'viem'

/**
 * MiniPay Integration Module
 * Handles phone number to address resolution for MiniPay users
 *
 * Best Practices:
 * - Validates both phone numbers and Ethereum addresses
 * - Provides fallback to direct address input
 * - Uses Celo's Attestation service for phone verification (production)
 * - Mock implementation for testnet demo purposes
 */

export interface PhoneResolutionResult {
  address: `0x${string}` | null
  isPhoneNumber: boolean
  error?: string
}

/**
 * Validates if a string is a valid phone number format
 * Supports international format: +[country code][number]
 * Examples: +254712345678, +234806123456, +256701234567
 */
export function isValidPhoneNumber(input: string): boolean {
  // Remove spaces and dashes
  const cleaned = input.replace(/[\s-]/g, '')

  // Check for international format: + followed by 10-15 digits
  const phoneRegex = /^\+[1-9]\d{9,14}$/

  return phoneRegex.test(cleaned)
}

/**
 * Validates if a string is a valid Ethereum address
 */
export function isValidAddress(input: string): boolean {
  return isAddress(input)
}

/**
 * Resolve phone number to Celo address
 *
 * Production Implementation:
 * - Use @celo/identity for attestation lookup
 * - Query Celo's decentralized phone number registry
 * - Verify attestations for security
 *
 * Testnet/Demo Implementation:
 * - Maps known test phone numbers to addresses
 * - Provides mock resolution for demo purposes
 * - Falls back to address input if phone not found
 */
export async function resolvePhoneToAddress(
  input: string
): Promise<PhoneResolutionResult> {
  // Clean input
  const cleaned = input.trim()

  // Check if it's already a valid address
  if (isValidAddress(cleaned)) {
    return {
      address: cleaned as `0x${string}`,
      isPhoneNumber: false,
    }
  }

  // Check if it's a phone number
  if (!isValidPhoneNumber(cleaned)) {
    return {
      address: null,
      isPhoneNumber: false,
      error: 'Invalid phone number or address format',
    }
  }

  // For testnet demo: Mock phone number resolution
  // In production, replace this with actual Celo attestation lookup
  const mockPhoneRegistry = getMockPhoneRegistry()
  const address = mockPhoneRegistry.get(cleaned)

  if (address) {
    return {
      address: address as `0x${string}`,
      isPhoneNumber: true,
    }
  }

  // Phone number not registered
  return {
    address: null,
    isPhoneNumber: true,
    error: 'Phone number not registered with MiniPay. Please use wallet address instead.',
  }
}

/**
 * Mock phone registry for testnet demonstration
 * In production, this would query Celo's on-chain attestation service
 *
 * Register test phone numbers here for demo purposes
 */
function getMockPhoneRegistry(): Map<string, string> {
  return new Map([
    // Format: ['+[country][number]', '0x[address]']
    // Kenya test numbers
    ['+254712345678', '0xA0b5D5441f77EC8F5245feCd27aFfF652345D52F'],
    ['+254723456789', '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'],

    // Nigeria test numbers
    ['+2348061234567', '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'],
    ['+2347012345678', '0x90F79bf6EB2c4f870365E785982E1f101E93b906'],

    // Uganda test numbers
    ['+256701234567', '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65'],
    ['+256751234567', '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc'],

    // Ghana test numbers
    ['+233244123456', '0x976EA74026E726554dB657fA54763abd0C3a0aa9'],
    ['+233542123456', '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955'],
  ])
}

/**
 * Format phone number for display
 * Adds spaces for better readability
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, '')

  if (!isValidPhoneNumber(cleaned)) {
    return phone
  }

  // Format as: +XXX XXX XXX XXX
  const countryCode = cleaned.slice(0, 4)
  const rest = cleaned.slice(4)
  const chunks = rest.match(/.{1,3}/g) || []

  return `${countryCode} ${chunks.join(' ')}`
}

/**
 * Get a list of test phone numbers for demo purposes
 * Display this in the UI to help users test the feature
 */
export function getTestPhoneNumbers(): Array<{ phone: string; country: string; address: string }> {
  return [
    { phone: '+254712345678', country: 'Kenya', address: '0xA0b5...D52F' },
    { phone: '+254723456789', country: 'Kenya', address: '0x7099...79C8' },
    { phone: '+2348061234567', country: 'Nigeria', address: '0x3C44...93BC' },
    { phone: '+2347012345678', country: 'Nigeria', address: '0x90F7...3b906' },
    { phone: '+256701234567', country: 'Uganda', address: '0x15d3...6A65' },
    { phone: '+233244123456', country: 'Ghana', address: '0x976E...0aa9' },
  ]
}

/**
 * Production implementation helper (for future use)
 * This shows how to integrate with Celo's actual attestation service
 */
export const PRODUCTION_IMPLEMENTATION_NOTE = `
To integrate with actual MiniPay phone number resolution:

1. Install dependencies:
   npm install @celo/contractkit @celo/identity

2. Use Celo's Attestation Service:
   import { OdisUtils } from '@celo/identity'
   import { ContractKit } from '@celo/contractkit'

   async function resolvePhoneProduction(phone: string) {
     const kit = ContractKit.newKit('https://forno.celo.org')
     const accounts = await kit.contracts.getAccounts()

     // Query attestation service for phone number
     const attestations = await accounts.lookupAccountByPhoneNumber(phone)

     return attestations
   }

3. Add phone number verification flow:
   - User enters phone number
   - Send SMS verification code
   - Verify code via attestation service
   - Map phone to address on-chain

For hackathon demo, the mock implementation is sufficient.
`
