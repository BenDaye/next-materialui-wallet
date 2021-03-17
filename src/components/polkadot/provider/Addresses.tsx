import { AddressesContext, AddressesProps } from '@components/polkadot/context';
import { useChain, useIsMountedRef } from '@components/polkadot/hook';
import { Children } from '@components/types';
import { keyring } from '@polkadot/ui-keyring';
import { sortAddresses } from '@components/polkadot/utils';
import { memo, ReactElement, useEffect, useState } from 'react';

function AddressesProvider({ children }: Children): ReactElement<Children> {
  const { isChainReady } = useChain();
  const [state, setState] = useState<AddressesProps>({
    addresses: [],
    hasAddress: false,
    isAddress: () => false,
    sortedAddresses: [],
  });

  useEffect(() => {
    if (!isChainReady) return;
    const subscription = keyring.addresses.subject.subscribe((value): void => {
      const addresses = value ? Object.keys(value) : [];
      const hasAddress = addresses.length !== 0;
      const isAddress = (address: string): boolean =>
        addresses.includes(address);

      const sortedAddresses = sortAddresses(addresses);

      setState({ addresses, hasAddress, isAddress, sortedAddresses });
    });

    return () => {
      setTimeout(() => subscription && subscription.unsubscribe(), 0);
    };
  }, [isChainReady]);

  return (
    <AddressesContext.Provider value={state}>
      {children}
    </AddressesContext.Provider>
  );
}

export default memo(AddressesProvider);
