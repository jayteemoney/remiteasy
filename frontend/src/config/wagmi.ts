import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { env } from './env'
import { celoSepolia, defaultChain } from './chains'

export const wagmiConfig = getDefaultConfig({
  appName: 'RemitEasy',
  projectId: env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [celoSepolia],
  transports: {
    [celoSepolia.id]: http('https://forno.celo-sepolia.celo-testnet.org', {
      retryCount: 3,
      retryDelay: 1000,
    }),
  },
})

export { defaultChain }
