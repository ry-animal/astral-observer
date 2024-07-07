import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';

const NftView = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (typeof slug === 'string') {
      setWalletAddress(slug);
    }
  }, [slug]);

  if (!walletAddress) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout>
      {({ chainName }) => (
        <div>
          <h1>NFT Collection for Wallet</h1>
          <p>Chain: {chainName}</p>
          <p>Wallet Address: {walletAddress}</p>
        </div>
      )}
    </AppLayout>
  );
};

export default NftView;
