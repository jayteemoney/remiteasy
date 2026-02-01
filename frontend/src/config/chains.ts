import { defineChain } from 'viem'

export const celoSepolia = defineChain({
  id: 11142220,
  name: 'Celo Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Celo',
    symbol: 'CELO',
  },
  rpcUrls: {
    default: {
      http: [
        'https://forno.celo-sepolia.celo-testnet.org',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Celoscan',
      url: 'https://celo-sepolia.blockscout.com',
    },
  },
  testnet: true,
})

export const celo = defineChain({
  id: 42220,
  name: 'Celo',
  nativeCurrency: {
    decimals: 18,
    name: 'Celo',
    symbol: 'CELO',
  },
  rpcUrls: {
    default: {
      http: ['https://forno.celo.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Celoscan',
      url: 'https://celoscan.io',
    },
  },
  testnet: false,
})

// For development/testing, use Celo Sepolia
export const supportedChains = [celoSepolia] as const
export const defaultChain = celoSepolia
