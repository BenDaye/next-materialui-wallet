import { Context, createContext } from 'react';
import { AccountContextProps } from './types';

export const AccountContext: Context<AccountContextProps> = createContext<AccountContextProps>(
  {
    accounts: [],
    hasAccount: false,
    isAccount: (uuid: string) => false,
    currentAccount: null,
    setCurrentAccount: (uuid: string | null) => {},
  }
);
