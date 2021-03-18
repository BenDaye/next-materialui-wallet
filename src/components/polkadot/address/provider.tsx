import type { BaseProps } from '@@/types';
import keyring from '@polkadot/ui-keyring';
import { memo, ReactElement, useEffect, useMemo, useState } from 'react';
import { useChain } from '../chain/hook';
import { AddressContext } from './context';
import type { AddressContextProps, AddressState } from './types';

const Address = ({ children }: BaseProps): ReactElement<BaseProps> => {
  const { isChainReady } = useChain();

  const [
    { addresses, hasAddress, isAddress },
    setState,
  ] = useState<AddressState>({
    addresses: [],
    hasAddress: false,
    isAddress: () => false,
  });

  const [currentAddress, setCurrentAddress] = useState<string | null>(null);

  const value = useMemo<AddressContextProps>(
    () => ({
      addresses,
      hasAddress,
      isAddress,
      currentAddress,
      setCurrentAddress,
    }),
    [addresses, hasAddress, currentAddress]
  );

  useEffect(() => {
    if (!isChainReady) return;
    const subscribeAddresses = keyring.addresses.subject.subscribe((value) => {
      const addresses = value ? Object.keys(value) : [];
      const hasAddress = addresses.length > 0;
      const isAddress = (v: string): boolean => addresses.includes(v);

      setState({ addresses, hasAddress, isAddress });
    });

    return () => {
      subscribeAddresses.unsubscribe();
    };
  }, [isChainReady]);

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
};

export const AddressProvider = memo(Address);
