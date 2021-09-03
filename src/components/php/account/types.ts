import { Dispatch, SetStateAction } from 'react';

export interface AccountState {
  accounts: AccountBaseProps[];
  hasAccount: boolean;
  isAccount: (address: string) => boolean;
}

export interface AccountContextProps extends AccountState {
  currentAccount: string | null;
  setCurrentAccount: Dispatch<SetStateAction<string | null>>;
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

export interface ImportAccountParams {
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

export interface ExportAccountParams extends AccountBaseProps {
  password: string;
  export_type: number;
  chain_type: string;
}

export interface ExportAccountResult {
  mnemonic: string;
  private_key: string;
}

export interface DeleteAccountParams extends AccountBaseProps {
  password: string;
}

export interface DeleteAccountResult {}

export interface ChangeNameParams extends AccountBaseProps {}

export interface ChangePasswordParams extends AccountBaseProps {
  password: string;
  new_password: string;
}

export interface GetAddressParams {
  chain_type: string;
  value: string;
}
