import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import CropFreeIcon from '@material-ui/icons/CropFree';
import React from 'react';
import { useAccounts } from '@components/polkadot/hook';
import { BalanceList } from '@components/wallet';
import { AccountSelector, AccountInfo } from '@components/account';

export default function Wallet() {
  const { currentAccount } = useAccounts();

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <AccountSelector />
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
          <AccountInfo value={currentAccount} showQrcode />
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
