import { Context, createContext } from 'react';
import { AccountBaseProps, AccountContextProps } from './types';

export const AccountContext: Context<AccountContextProps> =
  createContext<AccountContextProps>({
    accounts: [],
    hasAccount: false,
    isAccount: (uuid: string) => false,
    currentAccount: null,
    setCurrentAccount: (account: AccountBaseProps | null) => {},
  });
