import React, { memo, ReactElement, useEffect, useState } from 'react';
import { KeyringStore } from '@polkadot/ui-keyring/types';
import { Children } from '@components/types';
import { ChainContext } from './context';
import type { ChainContextProps } from './types';
import { useApi } from '../api/hook';
import { DEFAULT_CHAIN_PROPS, init } from './helper';
import { useError } from '@@/hook';

interface ChainProviderProps extends Children {
  store?: KeyringStore;
}

function Chain({
  children,
  store,
}: ChainProviderProps): ReactElement<ChainProviderProps> {
  const { api, isApiReady } = useApi();
  const { setError } = useError();
  const [state, setState] = useState<ChainContextProps>(DEFAULT_CHAIN_PROPS);

  useEffect(() => {
    init(api, store).then(setState).catch(setError);
  }, [api, isApiReady]);

  return (
    <ChainContext.Provider value={state}>{children}</ChainContext.Provider>
  );
}

export const ChainProvider = memo(Chain);
