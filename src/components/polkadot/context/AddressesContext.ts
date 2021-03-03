import { Context, createContext } from 'react';

export interface AddressesProps {
  addresses: string[];
  hasAddress: boolean;
  isAddress: (address: string) => boolean;
}

export const AddressesContext: Context<AddressesProps> = createContext<AddressesProps>(
  ({} as unknown) as AddressesProps
);
