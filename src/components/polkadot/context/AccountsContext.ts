import { Context, createContext, Dispatch, SetStateAction } from 'react';
import { KeyringAddress } from '@polkadot/ui-keyring/types';

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

export const AccountsContext: Context<AccountsProps> = createContext<AccountsProps>(
  ({} as unknown) as AccountsProps
);
