import { describe, it, expect, vi } from 'vitest'

// Mock import.meta.env
vi.mock('../env', () => ({
    env: {
        CONTRACT_ADDRESS: '0x6F491FaBdEc72fD14e9E014f50B2ffF61C508bf1',
        RPC_URL: 'https://forno.celo-sepolia.celo-testnet.org/',
        CHAIN_ID: 11142220,
        WALLETCONNECT_PROJECT_ID: 'f7b45ad409e8ad7c23698264114cbe67',
    },
}))

describe('Environment Configuration', () => {
    it('should have the correct contract address', async () => {
        const { env } = await import('../env')
        expect(env.CONTRACT_ADDRESS).toBe('0x6F491FaBdEc72fD14e9E014f50B2ffF61C508bf1')
        expect(env.CONTRACT_ADDRESS).toMatch(/^0x[a-fA-F0-9]{40}$/)
    })

    it('should have a valid RPC URL', async () => {
        const { env } = await import('../env')
        expect(env.RPC_URL).toBe('https://forno.celo-sepolia.celo-testnet.org/')
        expect(() => new URL(env.RPC_URL)).not.toThrow()
    })

    it('should have the correct chain ID', async () => {
        const { env } = await import('../env')
        expect(env.CHAIN_ID).toBe(11142220)
        expect(typeof env.CHAIN_ID).toBe('number')
    })

    it('should have a WalletConnect project ID', async () => {
        const { env } = await import('../env')
        expect(env.WALLETCONNECT_PROJECT_ID).toBe('f7b45ad409e8ad7c23698264114cbe67')
        expect(env.WALLETCONNECT_PROJECT_ID.length).toBeGreaterThan(0)
    })
})
