import { KeyringAddress } from '@polkadot/ui-keyring/types';

export interface SortedAccount {
  account: KeyringAddress;
  isDevelopment: boolean;
  shortAddress: string;
}

export interface Sorted {
  sortedAccounts: SortedAccount[];
  sortedAddresses: string[];
}
