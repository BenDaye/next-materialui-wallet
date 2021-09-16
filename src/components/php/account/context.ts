import { Context, createContext } from 'react';
import {
  AccountProps,
  AccountContextProps,
  DeleteAccountParams,
  ActivateAccountParams,
} from './types';

export const AccountContext: Context<AccountContextProps> =
  createContext<AccountContextProps>({
    accounts: [],
    hasAccount: false,
    isAccount: (value: string) => false,
    activateAccount: (params: ActivateAccountParams) => {},
    deleteAccount: (params: DeleteAccountParams) => {},
    updateAccount: (account: AccountProps) => {},
    updateAccounts: (accounts: AccountProps[]) => {},
    updateAllAccounts: () => {},
    importAccount: () => {},
  });
