import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useQuery } from '@tanstack/react-query';
import useMobile from '@/hooks/useMobile';

interface Token {
  id: string;
  tokenId: string;
  name: string;
  rarityOrder: number | null;
  rarityScore: number | null;
  mintedAt: string;
  saleType: string | null;
  media: {
    url: string;
    type: string;
  };
  collection: {
    name: string;
    contractAddress: string;
  };
}

interface OwnedTokensResponse {
  data: {
    tokens: {
      tokens: Token[];
      pageInfo: {
        total: number;
        limit: number;
        offset: number;
      };
    };
  };
}

const fetchOwnedTokens = async (owner: string, limit: number): Promise<Token[]> => {
  const response = await fetch('https://graphql.mainnet.stargaze-apis.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-apollo-operation-name': 'OwnedTokens',
    },
    body: JSON.stringify({
      operationName: 'OwnedTokens',
      variables: {
        owner: owner,
        filterForSale: null,
        sortBy: 'ACQUIRED_DESC',
        filterByCollectionAddrs: null,
        limit: limit,
      },
      query: `
        query OwnedTokens($owner: String, $seller: String, $limit: Int, $offset: Int, $filterByCollectionAddrs: [String!], $filterForSale: SaleType, $sortBy: TokenSort) {
          tokens(
            ownerAddrOrName: $owner
            sellerAddrOrName: $seller
            limit: $limit
            offset: $offset
            filterForSale: $filterForSale
            filterByCollectionAddrs: $filterByCollectionAddrs
            sortBy: $sortBy
          ) {
            tokens {
              id
              tokenId
              name
              rarityOrder
              rarityScore
              mintedAt
              saleType
              media {
                url
                type
              }
              collection {
                name
                contractAddress
              }
            }
            pageInfo {
              total
              limit
              offset
            }
          }
        }
      `,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: OwnedTokensResponse = await response.json();

  const filteredTokens = data.data.tokens.tokens.filter(
    (token) => token.media.type !== 'html' && (token.media.type === 'image' || token.media.type === 'animated_image'),
  );

  return filteredTokens;
};

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
);

const CenteredMessage = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center min-h-screen text-white font-apex gap-4">{children}</div>
);

const WalletCollection = () => {
  const router = useRouter();
  const { chainId, address } = router.query;
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(50);
  const [inputLimit, setInputLimit] = useState<string>('50');
  const [backgroundInput, setBackgroundInput] = useState<string>('');
  const [showSettings, setShowSettings] = useState(true);

  const isMobile = useMobile();

  useEffect(() => {
    if (typeof address === 'string') {
      setWalletAddress(address);
      const storedBackground = localStorage.getItem('customBackground');
      if (storedBackground) {
        setBackgroundInput(storedBackground);
      }
    }
  }, [address]);

  const {
    data: ownedTokens,
    isLoading,
    error,
    refetch,
  } = useQuery<Token[], Error>({
    queryKey: ['ownedTokens', walletAddress, limit],
    queryFn: () => fetchOwnedTokens(walletAddress!, limit),
    enabled: !!walletAddress,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputLimit(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newLimit = parseInt(inputLimit, 10);
    if (newLimit > 0) {
      setLimit(newLimit);
      refetch();
    }
  };

  const handleBackgroundSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    setCustomBackground: (url: string) => void,
  ) => {
    event.preventDefault();
    setCustomBackground(backgroundInput);
  };

  const renderContent = () => {
    return (
      <AppLayout>
        {({ chainName, setCustomBackground, clearCustomBackground }) => {
          if (!walletAddress) {
            return (
              <CenteredMessage>
                <LoadingSpinner />
                <div>Loading wallet address...</div>
              </CenteredMessage>
            );
          }

          if (isLoading) {
            return (
              <CenteredMessage>
                <LoadingSpinner />
                <div>Loading owned NFTs...</div>
              </CenteredMessage>
            );
          }

          if (error) {
            return (
              <CenteredMessage>
                <div>Error loading NFTs: {error.message}</div>
              </CenteredMessage>
            );
          }

          return (
            <div className="flex flex-col items-center justify-center min-h-screen text-white font-apex gap-8 p-8 mt-12 relative">
              {!showSettings && (
                <button
                  onClick={() => setShowSettings(true)}
                  className="absolute -top-4 left-8 bg-blue-500 px-4 py-2 rounded"
                >
                  SHOW SETTINGS
                </button>
              )}

              {showSettings && (
                <div className="bg-black bg-opacity-50 p-4 rounded-lg w-full max-w-md relative">
                  <button onClick={() => setShowSettings(false)} className="absolute top-2 right-2 text-white">
                    ✕
                  </button>
                  <form onSubmit={(e) => handleBackgroundSubmit(e, setCustomBackground)} className="mb-4">
                    <label htmlFor="background" className="mr-2">
                      Set Background Image URL:
                    </label>
                    <input
                      type="text"
                      id="background"
                      name="background"
                      value={backgroundInput}
                      onChange={(e) => setBackgroundInput(e.target.value)}
                      className="text-black px-2 py-1 rounded mr-2 w-full"
                    />
                    <button type="submit" className="bg-blue-500 px-4 py-1 rounded w-full mt-4">
                      Set Background
                    </button>
                  </form>
                  <button onClick={clearCustomBackground} className="bg-red-500 px-4 py-1 rounded w-full">
                    Clear Custom Background
                  </button>

                  {ownedTokens?.length && (
                    <form onSubmit={handleSubmit} className="mt-4 flex justify-between items-center gap-4">
                      <label htmlFor="limit" className="ml-2 sm:ml-0">
                        Limit NFTs
                      </label>
                      <input
                        type="number"
                        id="limit"
                        name="limit"
                        value={inputLimit}
                        onChange={handleInputChange}
                        min="1"
                        className="text-black px-2 py-1 rounded font-sans w-24 bg-white/75 flex-1"
                      />
                      <button type="submit" className="ml-2 bg-blue-500 px-4 py-1 rounded">
                        Apply
                      </button>
                    </form>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 font-stars text-lg">
                {ownedTokens &&
                  ownedTokens.map((token) => (
                    <div
                      key={token.id}
                      className="border rounded-lg overflow-hidden shadow-lg bg-gray-800/75 flex flex-col h-full"
                    >
                      <div className="flex-grow flex items-center justify-center overflow-hidden">
                        <img src={token.media.url} alt={token.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex flex-col p-2 md:p-4 gap-1 md:gap-2 h-24 md:h-28 border border-top-white">
                        <h3 className="font-semibold text-sm md:text-lg truncate">{token.name}</h3>
                        <p className="text-xxs md:text-sm text-gray-400 truncate">
                          {isMobile ? '' : 'Collection: '}
                          {token.collection.name}
                        </p>
                        <p className="text-xxs md:text-sm text-gray-400">Rarity: {token.rarityOrder ?? 'N/A'}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          );
        }}
      </AppLayout>
    );
  };

  return renderContent();
};

export default WalletCollection;
