import { http, createConfig } from 'wagmi'
import { celoSepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

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
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo_project_id',
      showQrModal: true,
    }),
  ],
  transports: {
    [celoSepoliaChain.id]: http(import.meta.env.VITE_RPC_URL),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
