import { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit'
import { wagmiConfig } from '@/config/wagmi'
import { queryClient } from '@/config/query-client'
import '@rainbow-me/rainbowkit/styles.css'

interface Web3ProviderProps {
  children: ReactNode
}

const customLightTheme = lightTheme({
  accentColor: '#35d07f',
  accentColorForeground: 'white',
  borderRadius: 'medium',
  fontStack: 'system',
})

const customDarkTheme = darkTheme({
  accentColor: '#35d07f',
  accentColorForeground: 'white',
  borderRadius: 'medium',
  fontStack: 'system',
})

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: customLightTheme,
            darkMode: customDarkTheme,
          }}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
