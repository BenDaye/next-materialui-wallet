import { Context, createContext } from 'react';
import { AddressesProps } from './types';

export const AddressesContext: Context<AddressesProps> = createContext<AddressesProps>(
  // ({} as unknown) as AddressesProps
  {
    addresses: [],
    hasAddress: false,
    isAddress: (address: string) => false,
  }
);
