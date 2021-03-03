import { KeyringAddress, KeyringStore } from '@polkadot/ui-keyring/types';
import { keyring } from '@polkadot/ui-keyring';
import {
  Authors,
  ChainProps,
  SortedAccount,
} from '@components/polkadot/context';
import registry from '@utils/type-registry';
import { DEFAULT_DECIMALS, DEFAULT_SS58, DEFAULT_AUX } from '@constants';
import { formatBalance, formatNumber } from '@polkadot/util';
import { deriveMapCache, setDeriveCache } from '@polkadot/api-derive/util';
import { ApiPromise } from '@polkadot/api';
import type BN from 'bn.js';
import { VoidFn } from '@polkadot/api/types';
import { HeaderExtended } from '@polkadot/api-derive';
import { Dispatch, SetStateAction } from 'react';

export function sortAccounts(addresses: string[]): SortedAccount[] {
  return addresses
    .map((address) => keyring.getAccount(address))
    .filter((account): account is KeyringAddress => !!account)
    .map(
      (account): SortedAccount => ({
        account,
        isDevelopment: !!account.meta.isTesting,
        shortAddress:
          account.address.length > 13
            ? `${account.address.slice(0, 6)}...${account.address.slice(-6)}`
            : account.address,
      })
    )
    .sort(
      (a, b) =>
        (a.account.meta.whenCreated || 0) - (b.account.meta.whenCreated || 0)
    );
}

export function isKeyringLoaded() {
  try {
    return !!keyring.keyring;
  } catch {
    return false;
  }
}

export async function getChainProps(api: ApiPromise): Promise<ChainProps> {
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

export async function initChain(
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

export async function subscribeValidator(
  api: ApiPromise,
  setValidators: Dispatch<SetStateAction<string[]>>
): Promise<VoidFn | null> {
  if (!api.query.session?.validators) return null;
  const unsubscribe = await api.query.session.validators(
    (validatorIds): void => {
      setValidators(validatorIds.map((validatorId) => validatorId.toString()));
    }
  );
  return unsubscribe;
}

export async function subscribeNewHeads(
  api: ApiPromise,
  setState: Dispatch<SetStateAction<Authors>>,
  byAuthor: Record<string, string>,
  eraPoints: Record<string, string>,
  MAX_HEADERS: number
): Promise<VoidFn | null> {
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