import { useContext, useEffect, useState } from 'react';
import { AddressContext } from './context';
import { getAddress } from './helper';
import { AddressContextProps, AddressProps, GetAddressParams } from './types';

export const useAddresses = (): AddressContextProps =>
  useContext<AddressContextProps>(AddressContext);

export const useAddress = ({
  uuid,
  name,
  address,
}: GetAddressParams): AddressProps | undefined => {
  const { addresses } = useAddresses();
  const [state, setState] = useState<AddressProps | undefined>(() =>
    getAddress({ uuid, name, address })
  );

  useEffect(() => {
    setState(getAddress({ uuid, name, address }));
  }, [uuid, name, address, addresses]);

  return state;
};
