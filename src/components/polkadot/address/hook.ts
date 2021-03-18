import { useContext } from 'react';
import { AddressContext } from './context';
import { AddressContextProps } from './types';

export const useAddress = (): AddressContextProps =>
  useContext<AddressContextProps>(AddressContext);

export {
  useAccountBaseByAddress as useAddressBaseByAddress,
  useSortedAccounts as useSortedAddresses,
  useAccountFullByAddress as useAddressFullByAddress,
} from '../account/hook';
