import { CallbackParams } from '../types';

export interface AccountState {
  accounts: AccountProps[];
  hasAccount: boolean;
  isAccount: (address: string) => boolean;
}

export interface AccountContextProps extends AccountState {
  activateAccount: (params: ActivateAccountParams) => void;
  deleteAccount: (params: DeleteAccountParams) => void;
  updateAccount: (account: AccountProps) => void;
  updateAccounts: (accounts: AccountProps[]) => void;
  updateAllAccounts: () => void;
  importAccount: () => void;
}

export interface AccountProps {
  uuid: string;
  address: string;
  name: string;
  chain_type: string;
  activated?: boolean;
}

export interface GetAccountParams extends CallbackParams {
  name?: string;
  uuid?: string;
  address?: string;
}

export interface ActivateAccountParams extends GetAccountParams {}
export interface DeleteAccountParams extends GetAccountParams {}

export interface SaveAccountParams extends AccountProps, CallbackParams {}

export interface GetAddressByParams extends CallbackParams {
  chain_type: string;
  value?: string;
}

export interface GetAddressByMnemonic extends GetAddressByParams {}
export interface GetAddressByPrivateKey extends GetAddressByParams {}
