import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useQuery } from '@tanstack/react-query';
import useMobile from '@/hooks/useMobile';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Token } from '@/graphql/interface';
import { fetchOwnedTokens } from '@/graphql/queries';

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
);

const CenteredMessage = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center min-h-screen text-white font-apex gap-4">{children}</div>
);

interface DraggableNFTProps {
  token: Token;
  index: number;
  moveNFT: (dragIndex: number, hoverIndex: number) => void;
  showSettings: boolean;
  removeNFT: (id: string) => void;
  isMobile: boolean;
}

const DraggableNFT: React.FC<DraggableNFTProps> = ({ token, index, moveNFT, showSettings, removeNFT, isMobile }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: 'nft',
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveNFT(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'nft',
    item: () => ({ id: token.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: showSettings,
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`border rounded-lg overflow-hidden shadow-lg bg-gray-800/75 flex flex-col h-full relative ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {showSettings && (
        <button
          onClick={() => removeNFT(token.id)}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
        >
          ✕
        </button>
      )}
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
  );
};

const WalletCollection = () => {
  const router = useRouter();
  const { chainId, address } = router.query;
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(300);
  const [inputLimit, setInputLimit] = useState<string>('300');
  const [backgroundInput, setBackgroundInput] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [modifiedTokens, setModifiedTokens] = useState<Token[] | null>(null);

  const isMobile = useMobile();

  useEffect(() => {
    if (typeof address === 'string') {
      setWalletAddress(address);
      const storedBackground = localStorage.getItem('customBackground');
      if (storedBackground) {
        setBackgroundInput(storedBackground);
      }
      const storedTokens = localStorage.getItem(`modifiedTokens_${address}`);
      if (storedTokens) {
        setModifiedTokens(JSON.parse(storedTokens));
      }
      const storedLimit = localStorage.getItem(`nftLimit_${address}`);
      if (storedLimit) {
        const parsedLimit = parseInt(storedLimit, 10);
        setLimit(parsedLimit);
        setInputLimit(storedLimit);
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

  useEffect(() => {
    if (ownedTokens && !modifiedTokens) {
      setModifiedTokens(ownedTokens);
    }
  }, [ownedTokens, modifiedTokens]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputLimit(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newLimit = parseInt(inputLimit, 10);
    if (newLimit > 0) {
      setLimit(newLimit);
      setModifiedTokens(null);
      if (walletAddress) {
        localStorage.setItem(`nftLimit_${walletAddress}`, newLimit.toString());
      }
      refetch();
    }
  };

  const handleReset = () => {
    setLimit(300);
    setInputLimit('300');
    setModifiedTokens(null);
    if (walletAddress) {
      localStorage.removeItem(`nftLimit_${walletAddress}`);
      localStorage.removeItem(`modifiedTokens_${walletAddress}`);
    }
    refetch();
  };

  const handleBackgroundSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    setCustomBackground: (url: string) => void,
  ) => {
    event.preventDefault();
    setCustomBackground(backgroundInput);
  };

  const moveNFT = (dragIndex: number, hoverIndex: number) => {
    if (!modifiedTokens) return;
    const draggedToken = modifiedTokens[dragIndex];
    const updatedTokens = [...modifiedTokens];
    updatedTokens.splice(dragIndex, 1);
    updatedTokens.splice(hoverIndex, 0, draggedToken);
    setModifiedTokens(updatedTokens);
    if (walletAddress) {
      localStorage.setItem(`modifiedTokens_${walletAddress}`, JSON.stringify(updatedTokens));
    }
  };

  const removeNFT = (id: string) => {
    if (!modifiedTokens) return;
    const updatedTokens = modifiedTokens.filter((token) => token.id !== id);
    setModifiedTokens(updatedTokens);
    if (walletAddress) {
      localStorage.setItem(`modifiedTokens_${walletAddress}`, JSON.stringify(updatedTokens));
    }
  };

  const renderContent = () => {
    return (
      <AppLayout>
        {({ chainName, setCustomBackground, clearCustomBackground, showClear }) => {
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

          if (!ownedTokens) {
            return (
              <CenteredMessage>
                <div>No NFTs found for this wallet address.</div>
              </CenteredMessage>
            );
          }

          return (
            <div className="flex flex-col items-center justify-center min-h-screen text-white font-apex gap-8 p-8 mt-20 relative">
              {!showSettings && (
                <button
                  onClick={() => setShowSettings(true)}
                  className="absolute -top-4 left-8 bg-blue-500 px-4 py-2 rounded"
                >
                  SHOW SETTINGS
                </button>
              )}

              {showSettings && (
                <div className="bg-black bg-opacity-50 p-4 rounded-lg w-full max-w-md relative mt-12 md:mt-4">
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

                  {showClear ? (
                    <button onClick={clearCustomBackground} className="bg-yellow-600 px-4 py-1 rounded w-full">
                      Clear Custom Background
                    </button>
                  ) : null}

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

                  <button onClick={handleReset} className="mt-4 bg-red-500 px-4 py-1 rounded w-full">
                    Reset to Original Settings
                  </button>

                  <p className="flex text-center justify-center mt-4">
                    You can drag and drop to change the ordering or click the X to remove from view. To reset, just
                    'Apply' with NFT limit.
                  </p>
                </div>
              )}

              <DndProvider backend={HTML5Backend}>
                <div
                  className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full relative ${
                    showSettings ? 'z-40' : 'z-[-1]'
                  }`}
                >
                  {modifiedTokens &&
                    modifiedTokens.map((token, index) => (
                      <DraggableNFT
                        key={token.id}
                        token={token}
                        index={index}
                        moveNFT={moveNFT}
                        showSettings={showSettings}
                        removeNFT={removeNFT}
                        isMobile={isMobile}
                      />
                    ))}
                </div>
              </DndProvider>
            </div>
          );
        }}
      </AppLayout>
    );
  };

  return renderContent();
};

export default WalletCollection;
