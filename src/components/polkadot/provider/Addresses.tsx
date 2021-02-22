import { Children } from '@components/types';
import { keyring } from '@polkadot/ui-keyring';
import {
  Context,
  createContext,
  memo,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useIsMountedRef } from '../hook/useIsMountedRef';

interface UseAddresses {
  addresses: string[];
  hasAddress: boolean;
  isAddress: (address: string) => boolean;
}

export const AddressesContext: Context<UseAddresses> = createContext<UseAddresses>(
  ({} as unknown) as UseAddresses
);

function AddressesProvider({ children }: Children): ReactElement<Children> {
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<UseAddresses>({
    addresses: [],
    hasAddress: false,
    isAddress: () => false,
  });

  useEffect((): (() => void) => {
    const subscription = keyring.addresses.subject.subscribe((value): void => {
      if (mountedRef.current) {
        const addresses = value ? Object.keys(value) : [];
        const hasAddress = addresses.length !== 0;
        const isAddress = (address: string): boolean =>
          addresses.includes(address);

        setState({ addresses, hasAddress, isAddress });
      }
    });

    return (): void => {
      setTimeout(() => subscription.unsubscribe(), 0);
    };
  }, [mountedRef]);

  return (
    <AddressesContext.Provider value={state}>
      {children}
    </AddressesContext.Provider>
  );
}

export default memo(AddressesProvider);

export const useAddresses = (): UseAddresses => useContext(AddressesContext);
