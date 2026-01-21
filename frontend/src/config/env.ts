import { z } from 'zod'

const envSchema = z.object({
  VITE_WALLETCONNECT_PROJECT_ID: z.string().min(1, 'WalletConnect Project ID is required'),
  VITE_CONTRACT_ADDRESS: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address'),
})

function getEnv() {
  const result = envSchema.safeParse({
    VITE_WALLETCONNECT_PROJECT_ID: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
    VITE_CONTRACT_ADDRESS: import.meta.env.VITE_CONTRACT_ADDRESS,
  })

  if (!result.success) {
    const errors = result.error.format()
    console.error('Environment validation failed:', errors)
    throw new Error('Missing or invalid environment variables. Check console for details.')
  }

  return result.data
}

export const env = getEnv()
