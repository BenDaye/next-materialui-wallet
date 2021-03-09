import { Context, createContext } from 'react';
import { AccountsProps } from './types';

export const AccountsContext: Context<AccountsProps> = createContext<AccountsProps>(
  // ({} as unknown) as AccountsProps
  {
    accounts: [],
    hasAccount: false,
    isAccount: (address: string) => false,
    sortedAccounts: [],
    currentAccount: null,
    setCurrentAccount: (address: string | null) => {},
  }
);
