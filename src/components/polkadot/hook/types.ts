// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type {
  DeriveAccountFlags,
  DeriveAccountRegistration,
} from '@polkadot/api-derive/types';
import type {
  AccountId,
  Balance,
  BlockNumber,
  Call,
  Exposure,
  Hash,
  RewardDestination,
  SessionIndex,
  StakingLedger,
  ValidatorPrefs,
} from '@polkadot/types/interfaces';
import type { IExtrinsic } from '@polkadot/types/types';
import type { KeyringJson$Meta } from '@polkadot/ui-keyring/types';
import type { Codec } from '@polkadot/types/types';

export type CallParam = any;

export type CallParams = [] | CallParam[];

export interface CallOptions<T> {
  defaultValue?: T;
  paramMap?: (params: any) => CallParams;
  transform?: (value: any) => T;
  withParams?: boolean;
  withParamsTransform?: boolean;
}

export type TxDef = [
  string,
  any[] | ((...params: any[]) => SubmittableExtrinsic<'promise'>)
];

export type TxDefs =
  | SubmittableExtrinsic<'promise'>
  | IExtrinsic
  | Call
  | TxDef
  | null;

export type TxSource<T extends TxDefs> = [T, boolean];

export interface ModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export interface Inflation {
  inflation: number;
  stakedReturn: number;
}

export interface Slash {
  accountId: AccountId;
  amount: Balance;
}

export interface SessionRewards {
  blockHash: Hash;
  blockNumber: BlockNumber;
  isEventsEmpty: boolean;
  reward: Balance;
  sessionIndex: SessionIndex;
  slashes: Slash[];
}

export interface ExtrinsicAndSenders {
  extrinsic: SubmittableExtrinsic<'promise'> | null;
  isSubmittable: boolean;
  sendTx: () => void;
  sendUnsigned: () => void;
}

export interface TxProps {
  accountId?: string | null;
  onChangeAccountId?: (_: string | null) => void;
  onSuccess?: () => void;
  onFailed?: () => void;
  onStart?: () => void;
  onUpdate?: () => void;
}

export interface TxState extends ExtrinsicAndSenders {
  isSending: boolean;
  accountId?: string | null;
  onChangeAccountId: (_: string | null) => void;
}

export interface UseSudo {
  allAccounts: string[];
  hasSudoKey: boolean;
  sudoKey?: string;
}

export interface AddressFlags extends DeriveAccountFlags {
  isDevelopment: boolean;
  isEditable: boolean;
  isExternal: boolean;
  isFavorite: boolean;
  isHardware: boolean;
  isInContacts: boolean;
  isInjected: boolean;
  isMultisig: boolean;
  isProxied: boolean;
  isOwned: boolean;
  isValidator: boolean;
  isNominator: boolean;
}

export interface AddressIdentity extends DeriveAccountRegistration {
  isGood: boolean;
  isBad: boolean;
  isKnownGood: boolean;
  isReasonable: boolean;
  isErroneous: boolean;
  isLowQuality: boolean;
  isExistent: boolean;
  waitCount: number;
}

export interface StakerState {
  controllerId: string | null;
  destination?: RewardDestination;
  exposure?: Exposure;
  hexSessionIdNext: string | null;
  hexSessionIdQueue: string | null;
  isLoading: boolean;
  isOwnController: boolean;
  isOwnStash: boolean;
  isStashNominating: boolean;
  isStashValidating: boolean;
  nominating?: string[];
  sessionIds: string[];
  stakingLedger?: StakingLedger;
  stashId: string;
  validatorPrefs?: ValidatorPrefs;
}

export interface PotentialAsset {
  account: string;
  assetId: string;
  decimals: number;
  key: string;
  symbol: string;
  type: string;
  _id: string;
}

export interface PotentialBalancesResponse {
  success: boolean;
  result: PotentialAsset[];
}

export interface PotentialBalance extends PotentialAsset {
  balance: Codec;
}

export interface Urc10Asset {
  assetId: string;
  decimals: number;
  owner: string;
  symbol: string;
  timestamp: number;
  _id: string;
}

export interface Urc10AssetResponseResult {
  count: number;
  docs: Urc10Asset[];
}

export interface Urc10AssetResponse {
  success: boolean;
  result: Urc10AssetResponseResult;
}

export interface Urc10Balance extends Urc10Asset {
  balance: Codec;
}

export interface TransferParams {
  owner?: string | null;
  symbol?: string | null;
  counterparty?: string | null;
  direction?: number | null;
}

export type AccountTypeInLocal =
  | 'isAccount'
  | 'isAddress'
  | 'isContract'
  | 'unknown';

export interface UseAccountInfo {
  accountIndex?: string;
  flags: AddressFlags;
  name: string;
  setName: React.Dispatch<string>;
  tags: string[];
  setTags: React.Dispatch<string[]>;
  genesisHash: string | null;
  identity?: AddressIdentity;
  meta?: KeyringJson$Meta;
  isNull: boolean;
  onSaveName: () => void;
  onSaveTags: () => void;
  onSetGenesisHash: (genesisHash: string | null) => void;
  onForget: (cb?: () => void) => void;
  type: AccountTypeInLocal;
}
