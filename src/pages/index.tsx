import { useEffect, useState } from 'react';
import PageLinkButton from '@/components/page-link';
import AppLayout from '@/layouts/app-layout';
import { ImagesIcon, PersonStanding, User, UserRoundIcon, UserRoundSearchIcon } from 'lucide-react';
import { useChain } from '@cosmos-kit/react';

export default function Home() {
  const [searchWallet, setSearchWallet] = useState('');
  const [myWalletAddress, setMyWalletAddress] = useState('');

  return (
    <AppLayout>
      {({ chainName }) => {
        const { address, status, chain } = useChain(chainName);

        useEffect(() => {
          if (status === 'Connected' && address) {
            setMyWalletAddress(address);
          } else {
            setMyWalletAddress('');
          }
        }, [address, status]);

        const getCollectionUrl = (address: string) => `/walletCollection?chainId=${chain.chain_id}&address=${address}`;

        return (
          <div className="flex flex-col items-center justify-center h-screen font-apex text-white gap-20">
            <PageLinkButton
              href={myWalletAddress ? getCollectionUrl(myWalletAddress) : '#'}
              disabled={!myWalletAddress}
            >
              My Collection
              <div className="flex gap-1">
                <UserRoundIcon />
                <ImagesIcon />
              </div>
            </PageLinkButton>

            <div className="flex flex-col items-center gap-2">
              <span className="text-xxs text-grey">ie. stars199s7sp2sfcu9s7z9qf9js4pxj3clem42yzspln</span>
              <input
                type="text"
                value={searchWallet}
                onChange={(e) => setSearchWallet(e.target.value)}
                placeholder="Enter wallet address"
                className="px-4 py-2 text-black rounded w-72 font-sans text-center bg-white/75"
                aria-label="Enter wallet address"
              />
              <PageLinkButton href={getCollectionUrl(searchWallet)} disabled={searchWallet.length === 0}>
                Search for Collection
                <div className="flex gap-1">
                  <UserRoundSearchIcon />
                  <ImagesIcon />
                </div>
              </PageLinkButton>
            </div>
          </div>
        );
      }}
    </AppLayout>
  );
}
