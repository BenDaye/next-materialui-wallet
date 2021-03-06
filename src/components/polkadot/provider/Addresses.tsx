import { AddressesContext, AddressesProps } from '@components/polkadot/context';
import { useChain, useIsMountedRef } from '@components/polkadot/hook';
import { Children } from '@components/types';
import { keyring } from '@polkadot/ui-keyring';
import { memo, ReactElement, useEffect, useState } from 'react';

function AddressesProvider({ children }: Children): ReactElement<Children> {
  const { isChainReady } = useChain();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<AddressesProps>({
    addresses: [],
    hasAddress: false,
    isAddress: () => false,
  });

  useEffect((): (() => void) => {
    const subscription =
      isChainReady &&
      keyring.addresses.subject.subscribe((value): void => {
        if (mountedRef.current) {
          const addresses = value ? Object.keys(value) : [];
          const hasAddress = addresses.length !== 0;
          const isAddress = (address: string): boolean =>
            addresses.includes(address);

          setState({ addresses, hasAddress, isAddress });
        }
      });

    return (): void => {
      setTimeout(() => subscription && subscription.unsubscribe(), 0);
    };
  }, [mountedRef, isChainReady]);

  return (
    <AddressesContext.Provider value={state}>
      {children}
    </AddressesContext.Provider>
  );
}

export default memo(AddressesProvider);
