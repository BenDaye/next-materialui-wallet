import { Context, createContext } from 'react';
import { AddressContextProps } from './types';

export const AddressContext: Context<AddressContextProps> = createContext<AddressContextProps>(
  {
    addresses: [],
    hasAddress: false,
    isAddress: (address: string) => false,
    currentAddress: null,
    setCurrentAddress: (address: string | null) => {},
  }
);
