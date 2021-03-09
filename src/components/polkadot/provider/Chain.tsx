import React, { memo, ReactElement, useEffect, useState } from 'react';
import { KeyringStore } from '@polkadot/ui-keyring/types';
import { Children } from '@components/types';
import { ChainContext, ChainProps } from '@components/polkadot/context';
import { useApi } from '@components/polkadot/hook';
import { DEFAULT_CHAIN_PROPS, getChainState } from '@components/polkadot/utils';
import { useError } from '@components/error';

interface ChainProviderProps extends Children {
  store?: KeyringStore;
}

function ChainProvider({
  children,
  store,
}: ChainProviderProps): ReactElement<ChainProviderProps> {
  const { api, isDevelopment, isApiReady } = useApi();
  const { setError } = useError();
  const [state, setState] = useState<ChainProps>(DEFAULT_CHAIN_PROPS);

  useEffect(() => {
    api &&
      isApiReady &&
      getChainState(api, isDevelopment, store).then(setState).catch(setError);
  }, [api, isDevelopment, isApiReady]);

  return (
    <ChainContext.Provider value={state}>{children}</ChainContext.Provider>
  );
}

export default memo(ChainProvider);
