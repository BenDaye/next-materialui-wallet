import {
  AccountProps,
  SaveAccountParams,
  GetAccountParams,
} from '../account/types';

export interface AddressProps extends AccountProps {}

export interface AddressState {
  addresses: AddressProps[];
  hasAddress: boolean;
  isAddress: (value: string) => boolean;
}

export interface AddressContextProps extends AddressState {
  activateAddress: (params: ActivateAddressParams) => void;
  deleteAddress: (params: DeleteAddressParams) => void;
  updateAddress: (address: AddressProps) => void;
  updateAddresses: (addresses: AddressProps[]) => void;
  updateAllAddresses: () => void;
  importAddress: () => void;
}

export interface SaveAddressParams extends SaveAccountParams {}

export interface GetAddressParams extends GetAccountParams {}
export interface ActivateAddressParams extends GetAddressParams {}
export interface DeleteAddressParams extends GetAddressParams {}

export interface DeleteAddressParams extends GetAddressParams {}
