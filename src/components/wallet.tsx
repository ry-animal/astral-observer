import { useEffect, useState } from 'react';
import { Box, ClipboardCopyText, Stack } from '@interchain-ui/react';
import { WalletStatus } from '@cosmos-kit/core';
import { useChain } from '@cosmos-kit/react';
import { chains } from 'chain-registry';
import { User } from './user';
import { Warning } from './warning';
import { ChainSelect } from './chain';
import { CHAIN_NAME, CHAIN_NAME_STORAGE_KEY } from '@/config';
import {
  ButtonConnect,
  ButtonConnected,
  ButtonConnecting,
  ButtonDisconnected,
  ButtonError,
  ButtonNotExist,
  ButtonRejected,
} from './connect';

export type WalletProps = {
  chainName?: string;
  onChainChange?: (chainName?: string) => void;
};

export function Wallet({ chainName = CHAIN_NAME, onChainChange = () => {} }: WalletProps) {
  const { chain, status, wallet, username, address, message, connect, openView } = useChain(chainName);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const ConnectButton = {
    [WalletStatus.Connected]: <ButtonConnected onClick={openView} />,
    [WalletStatus.Connecting]: <ButtonConnecting />,
    [WalletStatus.Disconnected]: <ButtonDisconnected onClick={connect} />,
    [WalletStatus.Error]: <ButtonError onClick={openView} />,
    [WalletStatus.Rejected]: <ButtonRejected onClick={connect} />,
    [WalletStatus.NotExist]: <ButtonNotExist onClick={openView} />,
  }[status] || <ButtonConnect onClick={connect} />;

  function handleChainChange(chainName?: string) {
    if (chainName) {
      onChainChange(chainName);
      localStorage.setItem(CHAIN_NAME_STORAGE_KEY, chainName!);
    }
  }

  useEffect(() => {
    const selected = localStorage.getItem(CHAIN_NAME_STORAGE_KEY);
    if (selected && selected !== chainName) {
      onChainChange(selected);
    }
  }, []);

  return (
    <Box className="fixed top-0 right-0 mt-4 z-[9999] flex items-end gap-2">
      <Box>
        <ChainSelect chains={chains} chainName={chain.chain_name} onChange={handleChainChange} />
      </Box>
      <div className="flex flex-col items-end w-40 text-lg mr-8">
        <button onClick={toggleVisibility} className="p-1 md:p-2 bg-blue-500 text-white rounded w-full">
          {isVisible ? 'HIDE WALLET' : 'SHOW WALLET'}
        </button>

        {isVisible && (
          <Stack
            direction="vertical"
            attributes={{
              width: '100%',
              maxWidth: '16rem',
              borderRadius: '$lg',
              justifyContent: 'center',
              backgroundColor: '$blackAlpha800',
              padding: '$4',
              marginTop: '$2',
            }}
          >
            {username && (
              <>
                <User name={username} />
                {address ? <ClipboardCopyText text={address} truncate="middle" /> : null}
              </>
            )}
            <Box
              flex="1"
              width="full"
              display="flex"
              height="$16"
              overflow="hidden"
              justifyContent="center"
              px={{ mobile: '$4', tablet: '$6' }}
              className="my-2"
            >
              {ConnectButton}
            </Box>

            {message && [WalletStatus.Error, WalletStatus.Rejected].includes(status) ? (
              <Warning text={`${wallet?.prettyName}: ${message}`} />
            ) : null}
          </Stack>
        )}
      </div>
    </Box>
  );
}
