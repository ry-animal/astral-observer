import AppLayout from '@/layouts/app-layout';
import { ProjectorIcon } from 'lucide-react';
import PageLinkButton from '@/components/page-link';

export default function Home() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center h-screen font-orphan text-white gap-4">
        <PageLinkButton href={`/walletCollection/${'pull own wallet here'}`}>
          My Collection
          <ProjectorIcon />
        </PageLinkButton>
        <PageLinkButton href={`/walletCollection/${'enter a wallet here'}`}>
          Search for Collection
          <ProjectorIcon />
        </PageLinkButton>
      </div>
    </AppLayout>
  );
}
