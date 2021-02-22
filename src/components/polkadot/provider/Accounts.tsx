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

interface UseAccounts {
  accounts: string[];
  hasAccount: boolean;
  isAccount: (address: string) => boolean;
}

export const AccountsContext: Context<UseAccounts> = createContext<UseAccounts>(
  ({} as unknown) as UseAccounts
);

function AccountsProvider({ children }: Children): ReactElement<Children> {
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<UseAccounts>({
    accounts: [],
    hasAccount: false,
    isAccount: () => false,
  });

  useEffect((): (() => void) => {
    const subscription = keyring.accounts.subject.subscribe((value): void => {
      if (mountedRef.current) {
        const accounts = value ? Object.keys(value) : [];
        const hasAccount = accounts.length !== 0;
        const isAccount = (address: string): boolean =>
          accounts.includes(address);

        setState({ accounts, hasAccount, isAccount });
      }
    });

    return (): void => {
      setTimeout(() => subscription.unsubscribe(), 0);
    };
  }, [mountedRef]);

  return (
    <AccountsContext.Provider value={state}>
      {children}
    </AccountsContext.Provider>
  );
}

export default memo(AccountsProvider);

export const useAccounts = (): UseAccounts => useContext(AccountsContext);
