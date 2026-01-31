import { defineChain } from 'viem'

export const celoAlfajores = defineChain({
  id: 44787,
  name: 'Celo Alfajores',
  nativeCurrency: {
    decimals: 18,
    name: 'Celo',
    symbol: 'CELO',
  },
  rpcUrls: {
    default: {
      http: [
        'https://alfajores-forno.celo-testnet.org',
        'https://forno.celo-testnet.org',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Celoscan',
      url: 'https://alfajores.celoscan.io',
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

// For development/testing, use Alfajores
export const supportedChains = [celoAlfajores] as const
export const defaultChain = celoAlfajores
