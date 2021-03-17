import {
  AccountsContext,
  AccountsProps,
  AccountsState,
} from '@components/polkadot/context';
import { useChain, useIsMountedRef } from '@components/polkadot/hook';
import { Children } from '@components/types';
import { keyring } from '@polkadot/ui-keyring';
import { memo, ReactElement, useEffect, useMemo, useState } from 'react';
import { sortAccounts } from '@components/polkadot/utils';

function AccountsProvider({ children }: Children): ReactElement<Children> {
  const { isChainReady } = useChain();
  const [
    { accounts, hasAccount, isAccount, sortedAccounts },
    setState,
  ] = useState<AccountsState>({
    accounts: [],
    hasAccount: false,
    isAccount: () => false,
    sortedAccounts: [],
  });

  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  const value = useMemo<AccountsProps>(
    () => ({
      accounts,
      hasAccount,
      isAccount,
      currentAccount,
      setCurrentAccount,
      sortedAccounts,
    }),
    [accounts, hasAccount, currentAccount, sortedAccounts]
  );

  useEffect(() => {
    if (!isChainReady) return;
    const subscription = keyring.accounts.subject.subscribe((value): void => {
      const accounts = value ? Object.keys(value) : [];
      const hasAccount = accounts.length !== 0;
      const isAccount = (address: string): boolean =>
        accounts.includes(address);
      const sortedAccounts = sortAccounts(accounts);

      setState({ accounts, hasAccount, isAccount, sortedAccounts });
    });

    return () => {
      setTimeout(() => subscription && subscription.unsubscribe(), 0);
    };
  }, [isChainReady]);

  useEffect(() => {
    if (!hasAccount || (currentAccount && !isAccount(currentAccount))) {
      setCurrentAccount(null);
    }
    if (hasAccount && !currentAccount) {
      setCurrentAccount(accounts[0]);
    }
  }, [accounts, hasAccount, currentAccount]);

  return (
    <AccountsContext.Provider value={value}>
      {children}
    </AccountsContext.Provider>
  );
}

export default memo(AccountsProvider);
