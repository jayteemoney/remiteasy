import { http, createConfig } from 'wagmi'
import { celoSepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'
import { env } from './env'

// Define Celo Sepolia chain (if not in wagmi/chains, we define it)
export const celoSepoliaChain = celoSepolia || {
  id: 11142220,
  name: 'Celo Sepolia Testnet',
  nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://forno.celo-sepolia.celo-testnet.org'] },
    public: { http: ['https://forno.celo-sepolia.celo-testnet.org'] },
  },
  blockExplorers: {
    default: { name: 'CeloScan', url: 'https://sepolia.celoscan.io' },
  },
  testnet: true,
}

export const config = createConfig({
  chains: [celoSepoliaChain],
  connectors: [
    // MetaMask and other injected wallets (prioritized first)
    injected({
      target: 'metaMask',
    }),
    // WalletConnect as fallback
    walletConnect({
      projectId: env.WALLETCONNECT_PROJECT_ID,
      showQrModal: true,
    }),
  ],
  transports: {
    [celoSepoliaChain.id]: http(env.RPC_URL),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
