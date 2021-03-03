import React, { memo, ReactElement } from 'react';
import type { Children } from '@components/types';
import { Box, Container } from '@material-ui/core';
import styles from '@styles/AccountPicker.module.css';
import { useAccounts } from '@components/polkadot/hook';
import AccountListItem from './AccountListItem';
import { SortedAccount } from '@components/polkadot/context';

interface AccountListProps extends Children {}

function AccountList({
  children,
}: AccountListProps): ReactElement<AccountListProps> {
  const { sortedAccounts } = useAccounts();

  return (
    <>
      <Box flexGrow={1} className={styles.content} py={1}>
        <Container>
          <Box className="width-fill-available">
            {sortedAccounts.map((account: SortedAccount, index: number) => (
              <Box my={1} key={`account-card:${index}`}>
                <AccountListItem
                  account={account}
                  showAddress
                  showBalance
                  showSelect
                />
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
