import { Dispatch, SetStateAction } from 'react';

export interface AddressState {
  addresses: string[];
  hasAddress: boolean;
  isAddress: (address: string) => boolean;
}

export interface AddressContextProps extends AddressState {
  currentAddress: string | null;
  setCurrentAddress: Dispatch<SetStateAction<string | null>>;
}
