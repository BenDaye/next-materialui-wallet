import { Context, createContext } from 'react';
import { AccountContextProps } from './types';

export const AccountContext: Context<AccountContextProps> = createContext<AccountContextProps>(
  {
    accounts: [],
    hasAccount: false,
    isAccount: (address: string) => false,
    currentAccount: null,
    setCurrentAccount: (address: string | null) => {},
  }
);
