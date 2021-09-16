import type { BaseProps } from '@@/types';
import { ImportAccountDialog } from '@components/account';
import React, { memo, ReactElement, useEffect, useMemo, useState } from 'react';
import { useChain } from '../chain/hook';
import { Chain } from '../chain/types';
import { AccountContext } from './context';
import {
  activateAccount as activate,
  deleteAccount as remove,
  getAccounts,
  saveAccount,
} from './helper';
import { useCurrentAccount } from './hook';
import {
  AccountContextProps,
  AccountProps,
  AccountState,
  ActivateAccountParams,
  DeleteAccountParams,
} from './types';

const Account = ({ children }: BaseProps): ReactElement<BaseProps> => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const { chains, setChains } = useChain();

  const [{ accounts, hasAccount, isAccount }, setState] =
    useState<AccountState>({
      accounts: [],
      hasAccount: false,
      isAccount: () => false,
    });
  const currentAccount = useCurrentAccount(accounts);

  const importAccount = () => setShowDialog(true);

  const activateAccount = (params: ActivateAccountParams) => {
    activate(params);
    updateAllAccounts();
  };

  const deleteAccount = (params: DeleteAccountParams) => {
    remove(params);
    updateAllAccounts();
  };

  const updateAccount = (account: AccountProps) => {
    saveAccount(account);
    updateAllAccounts();
  };

  const updateAccounts = (accounts: AccountProps[]) => {
    accounts.forEach((account) => saveAccount(account));
    updateAllAccounts();
  };

  const updateAllAccounts = () => {
    const _accounts = getAccounts({});
    setState({
      accounts: _accounts,
      hasAccount: _accounts.length > 0,
      isAccount: (value: string): boolean =>
        _accounts.some((v) => v.address === value) ||
        _accounts.some((v) => v.uuid === value),
    });
  };

  useEffect(() => {
    updateAllAccounts();
  }, []);

  useEffect(() => {
    if (currentAccount) {
      setChains(
        chains.map<Chain>((c: Chain) =>
          c.name === currentAccount.chain_type
            ? { ...c, activated: true }
            : { ...c, activated: false }
        )
      );
    } else {
      if (!hasAccount) return;
      activateAccount({ uuid: accounts[0].uuid });
      updateAllAccounts();
    }
  }, [accounts, hasAccount, currentAccount]);

  const value = useMemo<AccountContextProps>(
    () => ({
      accounts,
      hasAccount,
      isAccount,
      activateAccount,
      deleteAccount,
      updateAccount,
      updateAccounts,
      updateAllAccounts,
      importAccount,
    }),
    [accounts, hasAccount]
  );

  return (
    <AccountContext.Provider value={value}>
      {children}
      <ImportAccountDialog
        show={showDialog}
        onClose={() => {
          setShowDialog(false);
          updateAllAccounts();
        }}
      />
    </AccountContext.Provider>
  );
};

export const AccountProvider = memo(Account);
