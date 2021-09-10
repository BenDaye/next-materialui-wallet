import { useIsMountedRef } from '@@/hook';
import type { BaseProps } from '@@/types';
import { memo, ReactElement, useEffect, useMemo, useState } from 'react';
import useFetch from 'use-http';
import { AccountContext } from './context';
import { getAccounts } from './helper';
import { AccountBaseProps, AccountContextProps, AccountState } from './types';

const Account = ({ children }: BaseProps): ReactElement<BaseProps> => {
  const [{ accounts, hasAccount, isAccount }, setState] =
    useState<AccountState>({
      accounts: [],
      hasAccount: false,
      isAccount: () => false,
    });
  const [currentAccount, setCurrentAccount] = useState<AccountBaseProps | null>(
    null
  );
  const mountedRef = useIsMountedRef();

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
    const accountsInStore = getAccounts({});
    setState({
      accounts: accountsInStore,
      hasAccount: accountsInStore.length > 0,
      isAccount: (value: string): boolean =>
        accountsInStore.some((v) => v.address === value) ||
        accountsInStore.some((v) => v.uuid === value),
    });
  }, [mountedRef]);

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};

export const AccountProvider = memo(Account);
