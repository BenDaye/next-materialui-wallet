import type {
  AccountId,
  BalanceOf,
  Call,
  Multisig,
  ProxyDefinition,
  ProxyType,
} from '@polkadot/types/interfaces';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import { ApiPromise } from '@polkadot/api';
import { isFunction } from '@polkadot/util';
import type { Option, Vec } from '@polkadot/types';
import { AddressFlags, AddressProxy, MultiState, ProxyState } from './types';
import type { ITuple } from '@polkadot/types/types';
import keyring from '@polkadot/ui-keyring';
import type { KeyringPair } from '@polkadot/keyring/types';
import { Signer } from '@polkadot/api/types';
import {
  Registry,
  SignerPayloadJSON,
  SignerResult,
} from '@polkadot/types/types';

export const NO_FLAGS = {
  accountOffset: 0,
  addressOffset: 0,
  isHardware: false,
  isMultisig: false,
  isProxied: false,
  isQr: false,
  isUnlockable: false,
  threshold: 0,
  who: [],
};

const lockCountdown: Record<string, number> = {};

export const UNLOCK_MINS = 15;

const LOCK_DELAY = UNLOCK_MINS * 60 * 1000;

export function recodeAddress(address: string | Uint8Array): string {
  return keyring.encodeAddress(keyring.decodeAddress(address));
}

export function cacheUnlock(pair: KeyringPair): void {
  lockCountdown[pair.address] = Date.now() + LOCK_DELAY;
}

export function unlockAccount({
  isUnlockCached,
  signAddress,
  signPassword,
}: AddressProxy): string | null {
  let publicKey;

  try {
    publicKey = keyring.decodeAddress(signAddress as string);
  } catch (error) {
    console.error(error);

    return 'unable to decode address';
  }

  const pair = keyring.getPair(publicKey);

  try {
    pair.decodePkcs8(signPassword);
    isUnlockCached && cacheUnlock(pair);
  } catch (error) {
    console.error(error);

    return (error as Error).message;
  }

  return null;
}

export function extractExternal(accountId: string | null): AddressFlags {
  if (!accountId) {
    return NO_FLAGS;
  }

  let publicKey;

  try {
    publicKey = keyring.decodeAddress(accountId);
  } catch (error) {
    console.error(error);

    return NO_FLAGS;
  }

  const pair = keyring.getPair(publicKey);
  const {
    isExternal,
    isHardware,
    isInjected,
    isMultisig,
    isProxied,
  } = pair.meta;
  const isUnlockable = !isExternal && !isHardware && !isInjected;

  if (isUnlockable) {
    const entry = lockCountdown[pair.address];

    if (entry && Date.now() > entry && !pair.isLocked) {
      pair.lock();
      lockCountdown[pair.address] = 0;
    }
  }

  return {
    accountOffset: (pair.meta.accountOffset as number) || 0,
    addressOffset: (pair.meta.addressOffset as number) || 0,
    hardwareType: pair.meta.hardwareType as string,
    isHardware: !!isHardware,
    isMultisig: !!isMultisig,
    isProxied: !!isProxied,
    isQr:
      !!isExternal && !isMultisig && !isProxied && !isHardware && !isInjected,
    isUnlockable: isUnlockable && pair.isLocked,
    threshold: (pair.meta.threshold as number) || 0,
    who: ((pair.meta.who as string[]) || []).map(recodeAddress),
  };
}

export function findCall(
  tx: Call | SubmittableExtrinsic<'promise'>
): { method: string; section: string } {
  try {
    const { method, section } = tx.registry.findMetaCall(tx.callIndex);

    return { method, section };
  } catch (error) {
    return { method: 'unknown', section: 'unknown' };
  }
}

export function filterProxies(
  allAccounts: string[],
  tx: Call | SubmittableExtrinsic<'promise'>,
  proxies: [string, ProxyType][]
): string[] {
  // check an array of calls to all have proxies as the address
  const checkCalls = (address: string, txs: Call[]): boolean =>
    !txs.some(
      (tx) => !filterProxies(allAccounts, tx, proxies).includes(address)
    );

  // get the call info
  const { method, section } = findCall(tx);

  return proxies
    .filter(([address, proxy]): boolean => {
      if (!allAccounts.includes(address)) {
        return false;
      }

      switch (proxy.toString()) {
        case 'Any':
          return true;
        case 'Governance':
          return [
            'council',
            'democracy',
            'elections',
            'electionsPhragmen',
            'poll',
            'society',
            'technicalCommittee',
            'tips',
            'treasury',
          ].includes(section);
        case 'IdentityJudgement':
          return section === 'identity' && method === 'provideJudgement';
        case 'NonTransfer':
          return !(
            section === 'balances' ||
            (section === 'indices' && method === 'transfer') ||
            (section === 'vesting' && method === 'vestedTransfer')
          );
        case 'Staking':
          return (
            section === 'staking' ||
            (section === 'utility' &&
              ((method === 'batch' &&
                checkCalls(address, tx.args[0] as Vec<Call>)) ||
                (method === 'asLimitedSub' &&
                  checkCalls(address, [tx.args[0] as Call]))))
          );
        case 'SudoBalances':
          return (
            (section === 'sudo' &&
              method === 'sudo' &&
              findCall(tx.args[0] as Call).section === 'balances') ||
            (section === 'utility' &&
              method === 'batch' &&
              checkCalls(address, tx.args[0] as Vec<Call>))
          );
        default:
          return false;
      }
    })
    .map(([address]) => address);
}

export async function queryForMultisig(
  api: ApiPromise,
  requestAddress: string,
  proxyAddress: string | null,
  tx: SubmittableExtrinsic<'promise'>
): Promise<MultiState | null> {
  const multiModule = api.tx.multisig ? 'multisig' : 'utility';

  if (isFunction(api.query[multiModule]?.multisigs)) {
    const address = proxyAddress || requestAddress;
    const { threshold, who } = extractExternal(address);
    const hash = (proxyAddress
      ? api.tx.proxy.proxy(requestAddress, null, tx)
      : tx
    ).method.hash;
    const optMulti = await api.query[multiModule].multisigs<Option<Multisig>>(
      address,
      hash
    );
    const multi = optMulti.unwrapOr(null);

    return multi
      ? {
          address,
          isMultiCall: multi.approvals.length + 1 >= threshold,
          who,
          whoFilter: who.filter((w) => !multi.approvals.some((a) => a.eq(w))),
        }
      : {
          address,
          isMultiCall: false,
          who,
          whoFilter: who,
        };
  }

  return null;
}

export async function queryForProxy(
  api: ApiPromise,
  allAccounts: string[],
  address: string,
  tx: SubmittableExtrinsic<'promise'>
): Promise<ProxyState | null> {
  if (isFunction(api.query.proxy?.proxies)) {
    const { isProxied } = extractExternal(address);
    const [_proxies] = await api.query.proxy.proxies<
      ITuple<[Vec<ITuple<[AccountId, ProxyType]> | ProxyDefinition>, BalanceOf]>
    >(address);
    const proxies =
      api.tx.proxy.addProxy.meta.args.length === 3
        ? (_proxies as ProxyDefinition[]).map(({ delegate, proxyType }): [
            string,
            ProxyType
          ] => [delegate.toString(), proxyType])
        : (_proxies as [AccountId, ProxyType][]).map(([delegate, proxyType]): [
            string,
            ProxyType
          ] => [delegate.toString(), proxyType]);
    const proxiesFilter = filterProxies(allAccounts, tx, proxies);

    if (proxiesFilter.length) {
      return { address, isProxied, proxies, proxiesFilter };
    }
  }

  return null;
}

let id = 0;

export class AccountSigner implements Signer {
  readonly #keyringPair: KeyringPair;
  readonly #registry: Registry;

  constructor(keyringPair: KeyringPair, registry: Registry) {
    this.#keyringPair = keyringPair;
    this.#registry = registry;
  }

  public signPayload(payload: SignerPayloadJSON): Promise<SignerResult> {
    return new Promise((resolve) => {
      const signed = this.#registry
        .createType('ExtrinsicPayload', payload, { version: payload.version })
        .sign(this.#keyringPair);

      resolve({
        id: ++id,
        ...signed,
      });
    });
  }
}
