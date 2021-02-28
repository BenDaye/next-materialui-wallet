import {
  AppBar,
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import FolderIcon from '@material-ui/icons/Folder';
import Identicon from '@polkadot/react-identicon';
import React, { useEffect, useMemo } from 'react';
import AccountPicker from '@components/wallet/AccountPicker';
import AccountListItem from '@components/wallet/AccountListItem';
import { useAccounts } from '@components';
import { SortedAccount } from '@components/wallet/type';
import keyring from '@polkadot/ui-keyring';
import AccountEmpty from '@components/wallet/AccountEmpty';
import BalanceList from '@components/wallet/BalanceList';

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
            <Typography variant="h6" align="center">
              钱包
            </Typography>
          </Box>
          <IconButton edge="end" color="inherit" aria-label="scan">
            <MenuIcon />
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
          <Box marginTop={2}>
            <Typography variant="h6">资产</Typography>
          </Box>
          <BalanceList />
        </Box>
      </Container>
    </>
  );
}
