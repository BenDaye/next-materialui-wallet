import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import CropFreeIcon from '@material-ui/icons/CropFree';
import React, { useMemo } from 'react';
import { SortedAccount } from '@components/polkadot/context';
import { useAccounts } from '@components/polkadot/hook';
import {
  AccountEmpty,
  AccountListItem,
  AccountPicker,
  BalanceList,
} from '@components/wallet';

function getAccount(
  currentAccount: string,
  sortedAccounts: SortedAccount[]
): SortedAccount | undefined {
  return sortedAccounts.find((v) => v.account.address === currentAccount);
}

export default function Wallet() {
  const { hasAccount, currentAccount, sortedAccounts } = useAccounts();

  const account = useMemo(
    () =>
      hasAccount &&
      currentAccount &&
      getAccount(currentAccount, sortedAccounts),
    [hasAccount, currentAccount, sortedAccounts]
  );

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <AccountPicker />
          <Box flexGrow={1}>
            <Typography>钱包</Typography>
          </Box>
          <IconButton edge="end" color="inherit" aria-label="scan">
            <CropFreeIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container>
        <Box display="flex" flexDirection="column" marginTop={1}>
          {account ? (
            <AccountListItem account={account} showAddress />
          ) : (
            <AccountEmpty />
          )}
          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              资产
            </Typography>
          </Box>
          <BalanceList />
        </Box>
      </Container>
    </>
  );
}
