import { Context, createContext } from 'react';
import {
  AddressProps,
  AddressContextProps,
  ActivateAddressParams,
  DeleteAddressParams,
} from './types';

export const AddressContext: Context<AddressContextProps> =
  createContext<AddressContextProps>({
    addresses: [],
    hasAddress: false,
    isAddress: (value: string) => false,
    activateAddress: (params: ActivateAddressParams) => {},
    deleteAddress: (params: DeleteAddressParams) => {},
    updateAddress: (account: AddressProps) => {},
    updateAddresses: (accounts: AddressProps[]) => {},
    updateAllAddresses: () => {},
    importAddress: () => {},
  });
