import { AddressesContext, AddressesProps } from '@components/polkadot/context';
import { useContext } from 'react';

export const useAddresses = (): AddressesProps => useContext(AddressesContext);
