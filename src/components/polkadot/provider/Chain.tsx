import React, { memo, ReactElement, useEffect, useState } from 'react';
import { KeyringStore } from '@polkadot/ui-keyring/types';
import { Children } from '@components/types';
import { ChainContext, ChainProps } from '@components/polkadot/context';
import { useApi } from '@components/polkadot/hook';
import { EMPTY_CHAIN_PROPERTIES, getChainState } from './utils';

interface ChainProviderProps extends Children {
  store?: KeyringStore;
}

const DEFAULT_CHAIN_PROPS: ChainProps = {
  properties: EMPTY_CHAIN_PROPERTIES,
  systemName: '<unknown>',
  systemVersion: '<unknown>',
  ss58Format: 42,
  tokenDecimals: [8],
  tokenSymbol: ['UECC'],
  genesisHash: '<unknown>',
  isChainReady: false,
};

function ChainProvider({
  children,
  store,
}: ChainProviderProps): ReactElement<ChainProviderProps> {
  const { api, isDevelopment, isApiReady } = useApi();
  const [state, setState] = useState<ChainProps>(DEFAULT_CHAIN_PROPS);

  useEffect(() => {
    isApiReady && getChainState(api, isDevelopment, store).then(setState);
  }, [api, isApiReady]);

  return (
    <ChainContext.Provider value={state}>{children}</ChainContext.Provider>
  );
}

export default memo(ChainProvider);
