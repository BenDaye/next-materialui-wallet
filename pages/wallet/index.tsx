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
import keyring from '@polkadot/ui-keyring';
import { SortedAccount } from '@components/polkadot/context';
import { useAccounts } from '@components/polkadot/hook';
import {
  AccountEmpty,
  AccountListItem,
  AccountPicker,
  BalanceList,
} from '@components/wallet';

function sortAccount(address: string): SortedAccount | undefined {
  const account = keyring.getAccount(address);
  return (
    account && {
      account,
      isDevelopment: !!account.meta.isTesting,
      shortAddress:
        account.address.length > 13
          ? `${account.address.slice(0, 6)}...${account.address.slice(-6)}`
          : account.address,
    }
  );
}

export default function Wallet() {
  const { hasAccount, currentAccount } = useAccounts();

  const account = useMemo(
    () => hasAccount && currentAccount && sortAccount(currentAccount),
    [hasAccount, currentAccount]
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
