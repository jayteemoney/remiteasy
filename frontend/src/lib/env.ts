/**
 * Environment Variable Validation
 * Validates required environment variables at startup and provides helpful error messages
 */

interface EnvConfig {
    CONTRACT_ADDRESS: `0x${string}`
    RPC_URL: string
    CHAIN_ID: number
    WALLETCONNECT_PROJECT_ID: string
}

/**
 * Validates that a required environment variable exists and is not empty
 */
function getRequiredEnv(key: string, envValue: string | undefined): string {
    if (!envValue || envValue.trim() === '') {
        throw new Error(
            `Missing required environment variable: ${key}\n` +
            `Please check your .env file and ensure ${key} is set.\n` +
            `See .env.example for reference.`
        )
    }
    return envValue.trim()
}

/**
 * Validates that an environment variable is a valid Ethereum address
 */
function validateAddress(key: string, value: string): `0x${string}` {
    if (!value.startsWith('0x') || value.length !== 42) {
        throw new Error(
            `Invalid Ethereum address for ${key}: ${value}\n` +
            `Expected format: 0x followed by 40 hexadecimal characters`
        )
    }
    return value as `0x${string}`
}

/**
 * Validates that an environment variable is a valid number
 */
function validateNumber(key: string, value: string): number {
    const num = Number(value)
    if (isNaN(num)) {
        throw new Error(`Invalid number for ${key}: ${value}\nExpected a valid number`)
    }
    return num
}

/**
 * Validates that an environment variable is a valid URL
 */
function validateUrl(key: string, value: string): string {
    try {
        new URL(value)
        return value
    } catch {
        throw new Error(`Invalid URL for ${key}: ${value}\nExpected a valid HTTP/HTTPS URL`)
    }
}

/**
 * Load and validate all required environment variables
 * Throws descriptive errors if any required variables are missing or invalid
 */
function loadEnv(): EnvConfig {
    try {
        // Get raw values
        const contractAddress = getRequiredEnv('VITE_CONTRACT_ADDRESS', import.meta.env.VITE_CONTRACT_ADDRESS)
        const rpcUrl = getRequiredEnv('VITE_RPC_URL', import.meta.env.VITE_RPC_URL)
        const chainId = getRequiredEnv('VITE_CHAIN_ID', import.meta.env.VITE_CHAIN_ID)
        const walletConnectProjectId = getRequiredEnv(
            'VITE_WALLETCONNECT_PROJECT_ID',
            import.meta.env.VITE_WALLETCONNECT_PROJECT_ID
        )

        // Validate formats
        return {
            CONTRACT_ADDRESS: validateAddress('VITE_CONTRACT_ADDRESS', contractAddress),
            RPC_URL: validateUrl('VITE_RPC_URL', rpcUrl),
            CHAIN_ID: validateNumber('VITE_CHAIN_ID', chainId),
            WALLETCONNECT_PROJECT_ID: walletConnectProjectId,
        }
    } catch (error) {
        // Log error to console for debugging
        console.error('❌ Environment Configuration Error:', error)
        throw error
    }
}

// Load and validate environment variables at module load time
// This ensures the app fails fast if configuration is invalid
export const env = loadEnv()

// Log successful configuration in development
if (import.meta.env.DEV) {
    console.log('✅ Environment variables validated successfully')
    console.log('📝 Configuration:', {
        CONTRACT_ADDRESS: env.CONTRACT_ADDRESS,
        RPC_URL: env.RPC_URL,
        CHAIN_ID: env.CHAIN_ID,
        WALLETCONNECT_PROJECT_ID: env.WALLETCONNECT_PROJECT_ID.slice(0, 8) + '...',
    })
}
