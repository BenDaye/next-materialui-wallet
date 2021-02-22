import { ApiPromise } from '@polkadot/api';
import React, {
  Context,
  createContext,
  memo,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useApi } from './Api';
import { ChainProps } from './types';
import registry from '@utils/type-registry';
import { DEFAULT_DECIMALS, DEFAULT_SS58, DEFAULT_AUX } from '@constants';
import { formatBalance } from '@polkadot/util';
import { deriveMapCache, setDeriveCache } from '@polkadot/api-derive/util';
import { keyring } from '@polkadot/ui-keyring';
import type BN from 'bn.js';
import { KeyringStore } from '@polkadot/ui-keyring/types';
import { Children } from '@components/types';

interface Props extends Children {
  store?: KeyringStore;
}

function isKeyringLoaded() {
  try {
    return !!keyring.keyring;
  } catch {
    return false;
  }
}

async function getChainProps(api: ApiPromise): Promise<ChainProps> {
  const [chainProperties, systemName, systemVersion] = await Promise.all([
    api.rpc.system.properties(),
    api.rpc.system.name(),
    api.rpc.system.version(),
  ]);
  const properties = registry.createType('ChainProperties', {
    ss58Format: api.consts.system?.ss58Prefix || chainProperties.ss58Format,
    tokenDecimals: chainProperties.tokenDecimals,
    tokenSymbol: chainProperties.tokenSymbol,
  });

  return {
    properties,
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString(),
  };
}

async function init(
  api: ApiPromise,
  isDevelopment: boolean,
  store?: KeyringStore
): Promise<ChainProps> {
  const { properties, systemName, systemVersion } = await getChainProps(api);

  const ss58Format = properties.ss58Format.unwrapOr(DEFAULT_SS58).toNumber();
  const tokenDecimals = properties.tokenDecimals.unwrapOr([DEFAULT_DECIMALS]);
  const tokenSymbol = properties.tokenSymbol.unwrapOr([
    formatBalance.getDefaults().unit,
    ...DEFAULT_AUX,
  ]);

  registry.setChainProperties(
    registry.createType('ChainProperties', {
      ss58Format,
      tokenDecimals,
      tokenSymbol,
    })
  );

  formatBalance.setDefaults({
    decimals: (tokenDecimals as BN[]).map((b) => b.toNumber()),
    unit: tokenSymbol[0].toString(),
  });

  isKeyringLoaded() ||
    keyring.loadAll({
      genesisHash: api.genesisHash,
      isDevelopment,
      ss58Format,
      store,
      type: 'sr25519',
    });

  setDeriveCache(api.genesisHash.toHex(), deriveMapCache);

  return {
    properties,
    systemName,
    systemVersion,
    ss58Format,
    tokenDecimals: properties.tokenDecimals?.toHuman(),
    tokenSymbol: properties.tokenSymbol?.toHuman(),
    genesisHash: api.genesisHash.toString(),
  };
}

export const ChainContext: Context<ChainProps> = createContext<ChainProps>(
  ({} as unknown) as ChainProps
);

function ChainProvider({ children, store }: Props): ReactElement<Props> {
  const { api, isApiReady, isDevelopment } = useApi();
  const [state, setState] = useState<ChainProps>();

  useEffect((): void => {
    if (isApiReady) init(api, isDevelopment, store).then(setState);
  }, [api, isApiReady]);

  return (
    <ChainContext.Provider value={state}>{children}</ChainContext.Provider>
  );
}

export default memo(ChainProvider);

export const useChain = (): ChainProps => useContext(ChainContext);
