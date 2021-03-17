import { HeaderExtended } from '@polkadot/api-derive';
import { ApiPromise } from '@polkadot/api';
import type { ChainType, ChainProperties } from '@polkadot/types/interfaces';
import type { Balance } from '@polkadot/types/interfaces/runtime/types';
import type { Codec } from '@polkadot/types/types';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { Urc10Balance } from '@components/polkadot/hook';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Dispatch, SetStateAction } from 'react';
import type { BlockNumber, EventRecord } from '@polkadot/types/interfaces';
import { KeyringPair$Json } from '@polkadot/keyring/types';

export interface ApiSystemInfo {
  systemChain: string;
  systemChainType: ChainType;
}
export interface ApiState {
  isApiReady: boolean;
  isDevelopment: boolean;
}

export interface ApiProps extends ApiState {
  api: ApiPromise;
  apiError: string | null;
  isApiConnected: boolean;
  isApiInitialized: boolean;
}

export interface ChainSystemInfo {
  properties: ChainProperties;
  systemChain: string;
  systemName: string;
  systemVersion: string;
}

export interface ChainProps extends ChainSystemInfo {
  ss58Format: number;
  tokenDecimals: number[];
  tokenSymbol: string[];
  genesisHash: string;
  isChainReady: boolean;
}

export interface BalancesProps {
  balances: BalanceProps[];
  defaultAssetBalance?: DeriveBalancesAll;
  urc10ModuleAssetsBalance: Urc10Balance[];
}

export interface BalanceProps {
  assetId?: string;
  symbol: string | string[];
  isDefault: boolean;
  decimals: string | string[] | number;
  balance?: Balance | Codec;
  balanceFormat?: string;
}

export interface SortedAccount {
  account: KeyringAddress;
  isDevelopment: boolean;
  shortAddress: string;
}

export interface AccountsState {
  accounts: string[];
  hasAccount: boolean;
  isAccount: (address: string) => boolean;
  sortedAccounts: SortedAccount[];
}

export interface AccountsProps extends AccountsState {
  currentAccount: string | null;
  setCurrentAccount: Dispatch<SetStateAction<string | null>>;
}

export interface SortedAddress extends KeyringAddress {
  shortAddress: string;
}

export interface AddressesProps {
  addresses: string[];
  hasAddress: boolean;
  isAddress: (address: string) => boolean;
  sortedAddresses: SortedAddress[];
}

export interface Authors {
  byAuthor: Record<string, string>;
  eraPoints: Record<string, string>;
  lastBlockAuthors: string[];
  lastBlockNumber?: string;
  lastHeader?: HeaderExtended;
  lastHeaders: HeaderExtended[];
}

export interface IndexedEvent {
  indexes: number[];
  record: EventRecord;
}

export interface KeyedEvent extends IndexedEvent {
  blockHash?: string;
  blockNumber?: BlockNumber;
  key: string;
}

export type EventsProps = KeyedEvent[];
