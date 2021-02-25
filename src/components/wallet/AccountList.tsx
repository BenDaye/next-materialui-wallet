import React, { memo, ReactElement, useEffect, useState } from 'react';
import { Children } from '@components/types';
import { Box, Container } from '@material-ui/core';
import styles from '@styles/AccountPicker.module.css';
import { useAccounts, useApi } from '@components/polkadot';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import keyring from '@polkadot/ui-keyring';
import { Sorted, SortedAccount } from './type';
import AccountListItem from './AccountListItem';

interface AccountListProps extends Children {}

function sortAccounts(addresses: string[]): SortedAccount[] {
  return addresses
    .map((address) => keyring.getAccount(address))
    .filter((account): account is KeyringAddress => !!account)
    .map(
      (account): SortedAccount => ({
        account,
        isDevelopment: !!account.meta.isTesting,
        shortAddress:
          account.address.length > 13
            ? `${account.address.slice(0, 6)}...${account.address.slice(-6)}`
            : account.address,
      })
    )
    .sort(
      (a, b) =>
        (a.account.meta.whenCreated || 0) - (b.account.meta.whenCreated || 0)
    );
}

function AccountList({
  children,
}: AccountListProps): ReactElement<AccountListProps> {
  const { api } = useApi();
  const { accounts, hasAccount } = useAccounts();
  const [{ sortedAccounts, sortedAddresses }, setSorted] = useState<Sorted>({
    sortedAccounts: [],
    sortedAddresses: [],
  });

  useEffect(() => {
    const sortedAccounts = sortAccounts(accounts);
    const sortedAddresses = sortedAccounts.map(
      (account: SortedAccount) => account.account.address
    );

    setSorted({ sortedAccounts, sortedAddresses });
  }, [accounts, hasAccount]);

  return (
    <>
      <Box flexGrow={1} className={styles.content} py={1}>
        <Container>
          <Box className="width-fill-available">
            {sortedAccounts.map((account: SortedAccount, index: number) => (
              <Box my={1} key={`account-card:${index}`}>
                <AccountListItem account={account} />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
      {children}
    </>
  );
}

export default memo(AccountList);
