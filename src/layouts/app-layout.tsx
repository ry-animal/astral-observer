import { useState } from 'react';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import bgImage from '@/assets/images/astral.jpg';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { CHAIN_NAME } from '@/config';
import { Wallet } from '@/components/wallet';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [chainName, setChainName] = useState(CHAIN_NAME);

  function onChainChange(chainName?: string) {
    setChainName(chainName!);
  }

  const wallet = <Wallet chainName={chainName} onChainChange={onChainChange} />;
  return (
    <div className={cn('min-h-screen font-sans antialiased', fontSans.variable)}>
      <div style={{ backgroundImage: `url(${bgImage.src})` }} className="fixed inset-0 bg-cover bg-center" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header wallet={wallet} />
        <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
