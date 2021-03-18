import type { ChainProperties, ChainType } from '@polkadot/types/interfaces';
import type { ChainContextProps, ChainSystemInfo } from './types';
import registry from '../utils/typeRegistry';
import keyring from '@polkadot/ui-keyring';
import { ApiPromise } from '@polkadot/api';
import { assert, formatBalance, isTestChain } from '@polkadot/util';
import { KeyringStore } from '@polkadot/ui-keyring/types';
import BN from 'bn.js';
import { deriveMapCache, setDeriveCache } from '@polkadot/api-derive/util';

export const DEFAULT_DECIMALS = registry.createType('u32', 12);

export const DEFAULT_SS58 = registry.createType('u32', 42);

export const DEFAULT_AUX = [
  'Aux1',
  'Aux2',
  'Aux3',
  'Aux4',
  'Aux5',
  'Aux6',
  'Aux7',
  'Aux8',
  'Aux9',
];

export const DEFAULT_CHAIN_PROPERTIES: ChainProperties = registry.createType(
  'ChainProperties'
);

export const DEFAULT_CHAIN_TYPE: ChainType = registry.createType(
  'ChainType',
  'Live'
);

export const DEFAULT_CHAIN_PROPS: ChainContextProps = {
  properties: DEFAULT_CHAIN_PROPERTIES,
  systemChain: '<unknown>',
  systemChainType: DEFAULT_CHAIN_TYPE,
  systemName: '<unknown>',
  systemVersion: '<unknown>',
  ss58Format: 42,
  tokenDecimals: [10],
  tokenSymbol: ['Unit'],
  genesisHash: '<unknown>',
  isChainReady: false,
  isDevelopment: true,
};

export function isKeyringLoaded() {
  try {
    return !!keyring.keyring;
  } catch {
    return false;
  }
}

export async function getChainSystemInfo(
  api: ApiPromise
): Promise<ChainSystemInfo> {
  assert(api, 'API_REQUIRED');
  await api.isReady;

  const [
    chainProperties,
    systemChain,
    systemChainType,
    systemName,
    systemVersion,
  ] = await Promise.all([
    api.rpc.system.properties(),
    api.rpc.system.chain(),
    api.rpc.system.chainType
      ? api.rpc.system.chainType()
      : Promise.resolve(registry.createType('ChainType', 'Live')),
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
    systemChain: systemChain.toString(),
    systemChainType,
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString(),
  };
}

export async function init(
  api: ApiPromise,
  store?: KeyringStore
): Promise<ChainContextProps> {
  assert(api, 'api_required');
  await api.isReady;

  const {
    properties,
    systemChain,
    systemChainType,
    systemName,
    systemVersion,
  } = await getChainSystemInfo(api);

  const isDevelopment =
    systemChainType.isDevelopment ||
    systemChainType.isLocal ||
    isTestChain(systemChain);

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
    systemChain,
    systemChainType,
    systemName,
    systemVersion,
    ss58Format,
    tokenDecimals: (tokenDecimals as BN[]).map((b) => b.toNumber()),
    tokenSymbol: tokenSymbol.map((s: any) => s.toString()),
    genesisHash: api.genesisHash.toString(),
    isChainReady: true,
    isDevelopment,
  };
}
