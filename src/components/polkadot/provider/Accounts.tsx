import { Children } from '@components/types';
import { keyring } from '@polkadot/ui-keyring';
import {
  Context,
  createContext,
  Dispatch,
  memo,
  ReactElement,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useIsMountedRef } from '../hook/useIsMountedRef';

interface UseAccountsState {
  accounts: string[];
  hasAccount: boolean;
  isAccount: (address: string) => boolean;
}

interface UseAccountsContext extends UseAccountsState {
  currentAccount: string | null;
  setCurrentAccount: Dispatch<SetStateAction<string | null>>;
}

export const AccountsContext: Context<UseAccountsContext> = createContext<UseAccountsContext>(
  ({} as unknown) as UseAccountsContext
);

function AccountsProvider({ children }: Children): ReactElement<Children> {
  const mountedRef = useIsMountedRef();
  const [
    { accounts, hasAccount, isAccount },
    setState,
  ] = useState<UseAccountsState>({
    accounts: [],
    hasAccount: false,
    isAccount: () => false,
  });

  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  const value = useMemo<UseAccountsContext>(
    () => ({
      accounts,
      hasAccount,
      isAccount,
      currentAccount,
      setCurrentAccount,
    }),
    [accounts, hasAccount, currentAccount, mountedRef]
  );

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

  useEffect(() => {
    if (!hasAccount || (currentAccount && !isAccount(currentAccount))) {
      setCurrentAccount(null);
    }
    if (hasAccount && !currentAccount) {
      setCurrentAccount(accounts[0]);
    }
  }, [mountedRef, accounts, hasAccount, currentAccount]);

  return (
    <AccountsContext.Provider value={value}>
      {children}
    </AccountsContext.Provider>
  );
}

export default memo(AccountsProvider);

export const useAccounts = (): UseAccountsContext =>
  useContext(AccountsContext);
