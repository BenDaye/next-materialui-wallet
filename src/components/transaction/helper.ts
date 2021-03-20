import {
  AVAIL_STATUS,
  QueueTxMessageSetStatus,
  QueueTxResult,
  STATUS_COMPLETE,
} from '@components/polkadot/queue/types';
import type { QueueTx } from '@components/polkadot/queue/types';
import type {
  ItemState,
  AddressFlags,
  AddressProxy,
  Extracted,
  Param,
  Value,
  MultiState,
  ProxyState,
} from './types';
import { ApiPromise } from '@polkadot/api';
import type { DefinitionRpcExt } from '@polkadot/types/types';
import { assert, isFunction, loggerFormat } from '@polkadot/util';
import keyring from '@polkadot/ui-keyring';
import type { KeyringPair } from '@polkadot/keyring/types';
import type { Signer, SubmittableExtrinsic } from '@polkadot/api/types';
import type {
  ITuple,
  Registry,
  SignerPayloadJSON,
  SignerResult,
} from '@polkadot/types/types';
import { Enum, GenericCall, getTypeDef, Option, Vec } from '@polkadot/types';
import type { IExtrinsic, IMethod } from '@polkadot/types/types';
import type {
  ExtrinsicSignature,
  Multisig,
  ProxyDefinition,
  ProxyType,
  AccountId,
  BalanceOf,
  Call,
} from '@polkadot/types/interfaces';

export const NO_FLAGS: AddressFlags = {
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

export function extractCurrent(txqueue: QueueTx[]): ItemState {
  const available = txqueue.filter(({ status }) =>
    AVAIL_STATUS.includes(status)
  );
  const currentItem = available[0] || null;
  let isRpc = false;
  let isVisible = false;

  if (currentItem) {
    if (
      currentItem.status === 'queued' &&
      !(currentItem.extrinsic || currentItem.payload)
    ) {
      isRpc = true;
    } else if (currentItem.status !== 'signing') {
      isVisible = true;
    }
  }

  return {
    count: available.length,
    currentItem,
    isRpc,
    isVisible,
    requestAddress: (currentItem && currentItem.accountId) || null,
  };
}

export async function submitRpc(
  api: ApiPromise,
  { method, section }: DefinitionRpcExt,
  values: any[]
): Promise<QueueTxResult> {
  try {
    const rpc = api.rpc as Record<
      string,
      Record<string, (...params: unknown[]) => Promise<unknown>>
    >;

    assert(
      isFunction(rpc[section] && rpc[section][method]),
      `api.rpc.${section}.${method} does not exist`
    );

    const result = await rpc[section][method](...values);

    console.log('submitRpc: result ::', loggerFormat(result));

    return {
      result,
      status: 'sent',
    };
  } catch (error) {
    console.error(error);

    return {
      error: error as Error,
      status: 'error',
    };
  }
}

export async function sendRpc(
  api: ApiPromise,
  queueSetTxStatus: QueueTxMessageSetStatus,
  { id, rpc, values = [] }: QueueTx
): Promise<void> {
  if (rpc) {
    queueSetTxStatus(id, 'sending');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { error, result, status } = await submitRpc(api, rpc, values);

    queueSetTxStatus(id, status, result, error);
  }
}

const lockCountdown: Record<string, number> = {};
export const UNLOCK_MINS = 15;
const LOCK_DELAY = UNLOCK_MINS * 60 * 1000;

export function cacheUnlock(pair: KeyringPair): void {
  lockCountdown[pair.address] = Date.now() + LOCK_DELAY;
}

export function unlockAccount({
  isUnlockCached,
  signAddress,
  signPassword,
}: AddressProxy): void {
  const publicKey = keyring.decodeAddress(signAddress as string);
  const pair = keyring.getPair(publicKey);
  pair.decodePkcs8(signPassword);
  isUnlockCached && cacheUnlock(pair);
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

function isExtrinsic(value: IExtrinsic | IMethod): value is IExtrinsic {
  return !!(value as IExtrinsic).signature;
}

// This is no doubt NOT the way to do things - however there is no other option
function getRawSignature(value: IExtrinsic): ExtrinsicSignature | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (value as any)._raw?.signature?.multiSignature as ExtrinsicSignature;
}

export function extractState(
  value: IExtrinsic | IMethod,
  withHash?: boolean,
  withSignature?: boolean
): Extracted {
  const params = GenericCall.filterOrigin(value.meta).map(
    ({ name, type }): Param => ({
      name: name.toString(),
      type: getTypeDef(type.toString()),
    })
  );
  const values = value.args.map(
    (value): Value => ({
      isValid: true,
      value,
    })
  );
  const hash = withHash ? value.hash.toHex() : null;
  let signature: string | null = null;
  let signatureType: string | null = null;

  if (withSignature && isExtrinsic(value) && value.isSigned) {
    const raw = getRawSignature(value);

    signature = value.signature.toHex();
    signatureType = raw instanceof Enum ? raw.type : null;
  }

  return { hash, params, signature, signatureType, values };
}

export function recodeAddress(address: string | Uint8Array): string {
  return keyring.encodeAddress(keyring.decodeAddress(address));
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

export function filterTx(txqueue?: QueueTx[]): [QueueTx[], QueueTx[]] {
  const allTx = (txqueue || []).filter(
    ({ status }) => !['completed', 'incomplete'].includes(status)
  );

  return [
    allTx,
    allTx.filter(({ status }) => STATUS_COMPLETE.includes(status)),
  ];
}
