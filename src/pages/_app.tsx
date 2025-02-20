import type { AppProps } from 'next/app';
import { SignerOptions, wallets } from 'cosmos-kit';
import { ChainProvider } from '@cosmos-kit/react';
import { assets, chains } from 'chain-registry';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box, ThemeProvider, useTheme } from '@interchain-ui/react';

import '@/styles/globals.css';
import '@interchain-ui/react/styles';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const { themeClass } = useTheme();

  const signerOptions: SignerOptions = {
    // signingStargate: () => {
    //   return getSigningCosmosClientOptions();
    // }
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ChainProvider
          chains={chains}
          assetLists={assets}
          wallets={wallets}
          walletConnectOptions={{
            signClient: {
              projectId: 'a8510432ebb71e6948cfd6cde54b70f7',
              relayUrl: 'wss://relay.walletconnect.org',
              metadata: {
                name: 'Cosmos Kit dApp',
                description: 'Cosmos Kit dApp built by Create Cosmos App',
                url: 'https://docs.cosmology.zone/cosmos-kit/',
                icons: [],
              },
            },
          }}
          signerOptions={signerOptions}
        >
          <Component {...pageProps} />
        </ChainProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
