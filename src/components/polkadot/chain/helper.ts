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

export const DEFAULT_CHAIN_TYPE: ChainType = registry.createType(
  'ChainType',
  'Live'
);

export const DEFAULT_CHAIN_PROPS: ChainContextProps = {
  systemChain: '<unknown>',
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
      : Promise.resolve(DEFAULT_CHAIN_TYPE),
    api.rpc.system.name(),
    api.rpc.system.version(),
  ]);
  const properties = registry.createType('ChainProperties', {
    ss58Format: api.consts.system?.ss58Prefix || chainProperties.ss58Format,
    tokenDecimals: chainProperties.tokenDecimals,
    tokenSymbol: chainProperties.tokenSymbol,
  });

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

  const isDevelopment =
    systemChainType.isDevelopment ||
    systemChainType.isLocal ||
    isTestChain(systemChain.toString());

  return {
    systemChain: systemChain.toString(),
    isDevelopment,
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString(),
    ss58Format,
    tokenDecimals: (tokenDecimals as BN[]).map((b) => b.toNumber()),
    tokenSymbol: tokenSymbol.map((s: any) => s.toString()),
  };
}

export async function init(
  api: ApiPromise,
  store?: KeyringStore
): Promise<ChainContextProps> {
  assert(api, 'api_required');
  await api.isReady;

  const {
    systemChain,
    isDevelopment,
    systemName,
    systemVersion,
    ss58Format,
    tokenDecimals,
    tokenSymbol,
  } = await getChainSystemInfo(api);

  formatBalance.setDefaults({
    decimals: tokenDecimals,
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
    systemChain,
    systemName,
    systemVersion,
    ss58Format,
    tokenDecimals,
    tokenSymbol,
    genesisHash: api.genesisHash.toString(),
    isChainReady: true,
    isDevelopment,
  };
}
