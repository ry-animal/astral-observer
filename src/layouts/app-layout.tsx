import { useState, useEffect } from 'react';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import bgImage from '@/assets/images/astral.webp';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { CHAIN_NAME } from '@/config';
import { Wallet } from '@/components/wallet';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

interface AppLayoutProps {
  children: (props: {
    chainName: string;
    setCustomBackground: (url: string) => void;
    clearCustomBackground: () => void;
  }) => React.ReactNode;
  chainName?: string;
}

const AppLayout = ({ children, chainName: initialChainName = CHAIN_NAME }: AppLayoutProps) => {
  const [chainName, setChainName] = useState(initialChainName);
  const [customBackground, setCustomBackground] = useState<string | null>(null);

  useEffect(() => {
    const storedBackground = localStorage.getItem('customBackground');
    if (storedBackground) {
      setCustomBackground(storedBackground);
    }
  }, []);

  function onChainChange(chainName?: string) {
    setChainName(chainName!);
  }

  const setAndSaveCustomBackground = (url: string) => {
    setCustomBackground(url);
    localStorage.setItem('customBackground', url);
  };

  const clearCustomBackground = () => {
    setCustomBackground(null);
    localStorage.removeItem('customBackground');
  };

  const wallet = <Wallet chainName={chainName} onChainChange={onChainChange} />;

  return (
    <div className={cn('min-h-screen font-sans antialiased', fontSans.variable)}>
      <div
        style={{ backgroundImage: `url(${customBackground || bgImage.src})` }}
        className="fixed inset-0 bg-cover bg-center"
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header wallet={wallet} />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children({
            chainName,
            setCustomBackground: setAndSaveCustomBackground,
            clearCustomBackground,
          })}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
