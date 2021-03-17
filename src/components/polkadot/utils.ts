import { ApiPromise } from '@polkadot/api';
import {
  assert,
  formatBalance,
  formatNumber,
  isFunction,
  isTestChain,
  stringToU8a,
} from '@polkadot/util';
import {
  ApiState,
  ApiSystemInfo,
  Authors,
  ChainProps,
  ChainSystemInfo,
  EventsProps,
  IndexedEvent,
  KeyedEvent,
  SortedAccount,
} from './context';
import { TypeRegistry } from '@polkadot/types/create';
import type { ChainProperties } from '@polkadot/types/interfaces';
import { KeyringAddress, KeyringStore } from '@polkadot/ui-keyring/types';
import {
  DEFAULT_AUX,
  DEFAULT_DECIMALS,
  DEFAULT_SS58,
  MAX_EVENTS,
  MAX_HEADERS,
} from '@constants';
import BN from 'bn.js';
import keyring from '@polkadot/ui-keyring';
import { deriveMapCache, setDeriveCache } from '@polkadot/api-derive/util';
import { Dispatch, SetStateAction } from 'react';
import { VoidFn } from '@polkadot/api/types';
import { HeaderExtended } from '@polkadot/api-derive';
import { getShortAddress } from '@utils/getShortAddress';
import { xxhashAsHex } from '@polkadot/util-crypto';
import { SortedAddress } from './context/types';

export const registry = new TypeRegistry();

export async function getSystemInfo(api: ApiPromise): Promise<ApiSystemInfo> {
  assert(api, 'API_REQUIRED');
  await api.isReady;

  const [systemChain, systemChainType] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.chainType
      ? api.rpc.system.chainType()
      : Promise.resolve(registry.createType('ChainType', 'Live')),
  ]);

  return {
    systemChain: (systemChain || '<unknown>').toString(),
    systemChainType,
  };
}

export async function getApiState(api: ApiPromise): Promise<ApiState> {
  assert(api, 'API_REQUIRED');
  await api.isReady;

  const { systemChain, systemChainType } = await getSystemInfo(api);

  const isDevelopment =
    systemChainType.isDevelopment ||
    systemChainType.isLocal ||
    isTestChain(systemChain);

  return {
    isApiReady: true,
    isDevelopment,
  };
}

export const EMPTY_CHAIN_PROPERTIES: ChainProperties = registry.createType(
  'ChainProperties'
);

export const DEFAULT_CHAIN_PROPS: ChainProps = {
  properties: EMPTY_CHAIN_PROPERTIES,
  systemChain: '<unknown>',
  systemName: '<unknown>',
  systemVersion: '<unknown>',
  ss58Format: 42,
  tokenDecimals: [8],
  tokenSymbol: ['UECC'],
  genesisHash: '<unknown>',
  isChainReady: false,
};

export async function getChainSystemInfo(
  api: ApiPromise
): Promise<ChainSystemInfo> {
  assert(api, 'API_REQUIRED');
  await api.isReady;

  const [
    chainProperties,
    systemChain,
    systemName,
    systemVersion,
  ] = await Promise.all([
    api.rpc.system.properties(),
    api.rpc.system.chain(),
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
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString(),
  };
}

export function isKeyringLoaded() {
  try {
    return !!keyring.keyring;
  } catch {
    return false;
  }
}

export async function getChainState(
  api: ApiPromise,
  isDevelopment: boolean = true,
  store?: KeyringStore
): Promise<ChainProps> {
  assert(api, 'API_REQUIRED');
  await api.isReady;

  const {
    properties,
    systemChain,
    systemName,
    systemVersion,
  } = await getChainSystemInfo(api);

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

  // if (isKeyringLoaded()) {
  //   keyring.setDevMode(isDevelopment);
  //   keyring.setSS58Format(ss58Format);
  // } else {
  //   keyring.loadAll({
  //     genesisHash: api.genesisHash,
  //     isDevelopment,
  //     ss58Format,
  //     store,
  //     type: 'sr25519',
  //   });
  // }

  setDeriveCache(api.genesisHash.toHex(), deriveMapCache);

  return {
    properties,
    systemChain,
    systemName,
    systemVersion,
    ss58Format,
    tokenDecimals: (tokenDecimals as BN[]).map((b) => b.toNumber()),
    tokenSymbol: tokenSymbol.map((s: any) => s.toString()),
    genesisHash: api.genesisHash.toString(),
    isChainReady: true,
  };
}

export async function subscribeValidator(
  api: ApiPromise,
  setValidators: Dispatch<SetStateAction<string[]>>
): Promise<VoidFn | null> {
  assert(api, 'API_REQUIRED');
  await api.isReady;

  if (
    !api.query.session?.validators ||
    !isFunction(api.query.session?.validators)
  )
    return null;
  return await api.query.session.validators((validatorIds): void => {
    setValidators(validatorIds.map((validatorId) => validatorId.toString()));
  });
}

export async function subscribeNewHeads(
  api: ApiPromise,
  setState: Dispatch<SetStateAction<Authors>>,
  byAuthor: Record<string, string>,
  eraPoints: Record<string, string>
): Promise<VoidFn | null> {
  assert(api, 'API_REQUIRED');
  await api.isReady;

  if (
    !api.derive.chain.subscribeNewHeads ||
    !isFunction(api.derive.chain.subscribeNewHeads)
  )
    return null;
  let lastHeaders: HeaderExtended[] = [];
  let lastBlockAuthors: string[] = [];
  let lastBlockNumber = '';
  return await api.derive.chain.subscribeNewHeads((lastHeader): void => {
    if (lastHeader?.number) {
      const blockNumber = lastHeader.number.unwrap();
      const thisBlockAuthor =
        lastHeader.author?.toString() || `<unknown>:${Date.now()}`;
      const thisBlockNumber = formatNumber(blockNumber);

      if (thisBlockAuthor) {
        byAuthor[thisBlockAuthor] = thisBlockNumber;

        if (thisBlockNumber !== lastBlockNumber) {
          lastBlockNumber = thisBlockNumber;
          lastBlockAuthors = [thisBlockAuthor];
        } else {
          lastBlockAuthors.push(thisBlockAuthor);
        }
      }

      lastHeaders = lastHeaders
        .filter(
          (old, index) =>
            index < MAX_HEADERS && old.number.unwrap().lt(blockNumber)
        )
        .reduce(
          (next, header): HeaderExtended[] => {
            next.push(header);

            return next;
          },
          [lastHeader]
        )
        .sort((a, b) => b.number.unwrap().cmp(a.number.unwrap()));

      setState({
        byAuthor,
        eraPoints,
        lastBlockAuthors: lastBlockAuthors.slice(),
        lastBlockNumber,
        lastHeader,
        lastHeaders,
      });
    }
  });
}

export async function subscribeEvents(
  api: ApiPromise,
  setState: Dispatch<SetStateAction<EventsProps>>
): Promise<VoidFn | null> {
  assert(api, 'API_REQUIRED');
  await api.isReady;

  if (
    !api.query.system.events ||
    !isFunction(api.derive.chain.subscribeNewHeads)
  )
    return null;

  let prevBlockHash: string | null = null;
  let prevEventHash: string | null = null;
  return await api.query.system.events((records): void => {
    const newEvents: IndexedEvent[] = records
      .map((record, index) => ({ indexes: [index], record }))
      .filter(
        ({
          record: {
            event: { method, section },
          },
        }) =>
          section !== 'system' &&
          (method !== 'Deposit' ||
            !['balances', 'treasury'].includes(section)) &&
          (section !== 'inclusion' ||
            !['CandidateBacked', 'CandidateIncluded'].includes(method))
      )
      .reduce((combined: IndexedEvent[], e): IndexedEvent[] => {
        const prev = combined.find(
          ({
            record: {
              event: { method, section },
            },
          }) =>
            e.record.event.section === section &&
            e.record.event.method === method
        );

        if (prev) {
          prev.indexes.push(...e.indexes);
        } else {
          combined.push(e);
        }

        return combined;
      }, [])
      .reverse();
    const newEventHash = xxhashAsHex(stringToU8a(JSON.stringify(newEvents)));

    if (newEventHash !== prevEventHash && newEvents.length) {
      prevEventHash = newEventHash;

      // retrieve the last header, this will map to the current state
      api.rpc.chain.getHeader().then((header): void => {
        const blockNumber = header.number.unwrap();
        const blockHash = header.hash.toHex();

        if (blockHash !== prevBlockHash) {
          prevBlockHash = blockHash;

          setState((events) =>
            [
              ...newEvents.map(
                ({ indexes, record }): KeyedEvent => ({
                  blockHash,
                  blockNumber,
                  indexes,
                  key: `${blockNumber.toNumber()}-${blockHash}-${indexes.join(
                    '.'
                  )}`,
                  record,
                })
              ),
              // remove all events for the previous same-height blockNumber
              ...events.filter((p) => !p.blockNumber?.eq(blockNumber)),
            ].slice(0, MAX_EVENTS)
          );
        }
      });
    }
  });
}

export function sortAccounts(addresses: string[]): SortedAccount[] {
  return addresses
    .map((address) => keyring.getAccount(address))
    .filter((account): account is KeyringAddress => !!account)
    .map(
      (account): SortedAccount => ({
        account,
        isDevelopment: !!account.meta.isTesting,
        shortAddress: getShortAddress(account.address),
      })
    )
    .sort(
      (a, b) =>
        (a.account.meta.whenCreated || 0) - (b.account.meta.whenCreated || 0)
    );
}

export function sortAddresses(addresses: string[]): SortedAddress[] {
  return addresses
    .map((address) => keyring.getAddress(address))
    .filter((address): address is KeyringAddress => !!address)
    .map(
      (address): SortedAddress => ({
        address: address.address,
        meta: address.meta,
        publicKey: address.publicKey,
        shortAddress: getShortAddress(address.address),
      })
    )
    .sort((a, b) => (a.meta.whenCreated || 0) - (b.meta.whenCreated || 0));
}
