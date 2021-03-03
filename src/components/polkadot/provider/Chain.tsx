import React, { memo, ReactElement, useEffect, useState } from 'react';
import { KeyringStore } from '@polkadot/ui-keyring/types';
import { Children } from '@components/types';
import { ChainContext, ChainProps } from '@components/polkadot/context';
import { useApi } from '@components/polkadot/hook';
import { initChain } from './utils';

interface Props extends Children {
  store?: KeyringStore;
}

function ChainProvider({ children, store }: Props): ReactElement<Props> {
  const { api, isDevelopment } = useApi();
  const [state, setState] = useState<ChainProps>(({} as unknown) as ChainProps);

  useEffect((): void => {
    initChain(api, isDevelopment, store).then(setState);
  }, [api]);

  return (
    <ChainContext.Provider value={state}>{children}</ChainContext.Provider>
  );
}

export default memo(ChainProvider);
