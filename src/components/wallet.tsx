import { useEffect, useState } from 'react';
import { Box, ClipboardCopyText, Stack, useColorModeValue } from '@interchain-ui/react';
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
    <Box className="flex flex-col md:flex-row -mr-10 gap-4 md:mr-0">
      <Box mx="auto" maxWidth="16rem" className="top-0">
        <ChainSelect chains={chains} chainName={chain.chain_name} onChange={handleChainChange} />
      </Box>
      <div className="pt-2 flex flex-col gap-6 w-[200px] ml-8 md:ml-0">
        <button onClick={toggleVisibility}>{isVisible ? 'Hide Wallet' : 'Show Wallet'}</button>

        <Stack
          direction="vertical"
          attributes={{
            maxWidth: '16rem',
            borderRadius: '$lg',
            justifyContent: 'center',
            backgroundColor: useColorModeValue('$white', '$blackAlpha500'),
            boxShadow: useColorModeValue(
              '0 0 2px #dfdfdf, 0 0 6px -2px #d3d3d3',
              '0 0 2px #363636, 0 0 8px -2px #4f4f4f',
            ),
          }}
        >
          {username && isVisible && (
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
            px={{ mobile: '$8', tablet: '$10' }}
          >
            {isVisible && ConnectButton}
          </Box>

          {message && [WalletStatus.Error, WalletStatus.Rejected].includes(status) ? (
            <Warning text={`${wallet?.prettyName}: ${message}`} />
          ) : null}
        </Stack>
      </div>
    </Box>
  );
}
