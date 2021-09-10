import { Dispatch, SetStateAction } from 'react';

export interface AccountState {
  accounts: AccountBaseProps[];
  hasAccount: boolean;
  isAccount: (address: string) => boolean;
}

export interface AccountContextProps extends AccountState {
  currentAccount: AccountBaseProps | null;
  setCurrentAccount: Dispatch<SetStateAction<AccountBaseProps | null>>;
}

export interface AccountBaseProps {
  uuid: string;
  address: string;
  name: string;
  chain_type: string;
  mnemonic?: string;
  private_key?: string;
}

export interface AccountProps extends AccountBaseProps {
  onExport: (params: ExportAccountParams) => ExportAccountResult;
  onDelete: (params: DeleteAccountParams) => DeleteAccountResult;
  onChangeName: (params: ChangeNameParams) => void;
  onChangePassword: (params: ChangePasswordParams) => void;
}

export interface CallbackParams {
  onSuccess?: Function;
  onError?: Function;
}

export interface GetAccountParams extends CallbackParams {
  name?: string;
  uuid?: string;
  address?: string;
}

export interface SaveAccountParams extends AccountBaseProps, CallbackParams {}

export interface ImportAccountParams extends CallbackParams {
  name: string;
  password: string;
  mnemonic?: string;
  private_key?: string;
  chain_type: string;
}

export interface ImportAccountResult {
  uuid: string;
  name: string;
  address: string;
}

export interface ExportAccountParams extends AccountBaseProps, CallbackParams {
  password: string;
  export_type: number;
}

export interface ExportAccountResult {
  mnemonic: string;
  private_key: string;
}

export interface DeleteAccountParams extends AccountBaseProps, CallbackParams {
  password: string;
}

export interface DeleteAccountResult {}

export interface ChangeNameParams extends AccountBaseProps, CallbackParams {}

export interface ChangePasswordParams extends AccountBaseProps, CallbackParams {
  password: string;
  new_password: string;
}

export interface GetAddressParams extends CallbackParams {
  chain_type: string;
  value?: string;
}
