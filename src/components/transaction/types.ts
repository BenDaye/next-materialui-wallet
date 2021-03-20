import type { QueueTx } from '@components/polkadot/queue/types';
import type { Codec, TypeDef } from '@polkadot/types/types';
import type { ProxyType } from '@polkadot/types/interfaces';

export interface ItemState {
  count: number;
  currentItem: QueueTx | null;
  isRpc: boolean;
  isVisible: boolean;
  requestAddress: string | null;
}

export interface AddressFlags {
  accountOffset: number;
  addressOffset: number;
  hardwareType?: string;
  isHardware: boolean;
  isMultisig: boolean;
  isProxied: boolean;
  isQr: boolean;
  isUnlockable: boolean;
  threshold: number;
  who: string[];
}

export interface AddressProxy {
  isMultiCall: boolean;
  isUnlockCached: boolean;
  multiRoot: string | null;
  proxyRoot: string | null;
  signAddress: string | null;
  signPassword: string;
  flags: AddressFlags;
}

export interface Param {
  name: string;
  type: TypeDef;
}

export interface ParamDef {
  length?: number;
  name?: string;
  type: TypeDef;
}

export interface Value {
  isValid: boolean;
  value: Codec;
}

export interface Extracted {
  hash: string | null;
  params: Param[];
  signature: string | null;
  signatureType: string | null;
  values: Value[];
}

export interface MultiState {
  address: string;
  isMultiCall: boolean;
  who: string[];
  whoFilter: string[];
}

export interface PasswordState {
  isUnlockCached: boolean;
  signPassword: string;
}

export interface ProxyState {
  address: string;
  isProxied: boolean;
  proxies: [string, ProxyType][];
  proxiesFilter: string[];
}
