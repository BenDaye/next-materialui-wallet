import type { BaseProps } from '@@/types';
import keyring from '@polkadot/ui-keyring';
import { memo, ReactElement, useEffect, useMemo, useState } from 'react';
import { useChain } from '../chain/hook';
import { AccountContext } from './context';
import type { AccountContextProps, AccountState } from './types';

const Account = ({ children }: BaseProps): ReactElement<BaseProps> => {
  const { isChainReady } = useChain();

  const [
    { accounts, hasAccount, isAccount },
    setState,
  ] = useState<AccountState>({
    accounts: [],
    hasAccount: false,
    isAccount: () => false,
  });

  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  const value = useMemo<AccountContextProps>(
    () => ({
      accounts,
      hasAccount,
      isAccount,
      currentAccount,
      setCurrentAccount,
    }),
    [accounts, hasAccount, currentAccount]
  );

  useEffect(() => {
    if (!isChainReady) return;
    const subscribeAccounts = keyring.accounts.subject.subscribe((value) => {
      const accounts = value ? Object.keys(value) : [];
      const hasAccount = accounts.length > 0;
      const isAccount = (v: string): boolean => accounts.includes(v);

      setState({ accounts, hasAccount, isAccount });
    });

    return () => {
      subscribeAccounts.unsubscribe();
    };
  }, [isChainReady]);

  useEffect(() => {
    if (!currentAccount && hasAccount) {
      setCurrentAccount(accounts[0]);
    }
    if (currentAccount && hasAccount && !isAccount(currentAccount)) {
      setCurrentAccount(accounts[0]);
    }
    if (currentAccount && !hasAccount) {
      setCurrentAccount(null);
    }
  }, [currentAccount, hasAccount, isAccount, isChainReady]);

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};

export const AccountProvider = memo(Account);
