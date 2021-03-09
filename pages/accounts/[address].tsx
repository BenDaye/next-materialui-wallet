import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Container,
  TextField,
  Button,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';

import React, { useEffect, useMemo, useState } from 'react';
import { useError } from '@components/error';
import { useAccounts, useIsMountedRef } from '@components/polkadot/hook';
import { SortedAccount } from '@components/polkadot/context';
import { getSortedAccountName } from '@utils/getSortedAccountName';

export default function AccountByAddressPage() {
  const router = useRouter();
  const { address } = router.query;
  const mountedRef = useIsMountedRef();

  const {
    isAccount,
    currentAccount,
    sortedAccounts,
    hasAccount,
  } = useAccounts();
  const { setError } = useError();
  const [thisAccount, setThisAccount] = useState<SortedAccount | null>(null);

  useEffect(() => {
    let error: Error | null = null;
    if (!address) {
      error = new TypeError('Expected [address], but got undefined');
    } else if (typeof address !== 'string') {
      error = new TypeError(`Expected single [address], but got ${address}`);
    } else if (hasAccount && !isAccount(address)) {
      error = new TypeError(`{address} is not account`);
    }

    if (error) {
      setError(error);
      router.back();
    }
  }, [address, mountedRef, hasAccount, isAccount]);

  useEffect(() => {
    if (typeof address === 'string' && isAccount(address)) {
      const _thisAccount = sortedAccounts.find(
        (account) => account.account.address === address
      );
      _thisAccount && setThisAccount(_thisAccount);
    }
  }, [address, hasAccount, sortedAccounts, isAccount]);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" onClick={() => router.back()}>
            <ArrowBackIosIcon />
          </IconButton>
          <Box flexGrow={1}>
            <Typography>账户详情</Typography>
          </Box>
          <IconButton edge="end" onClick={() => router.push('/auth')}>
            <PlaylistAddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container>
        <Box display="flex" flexDirection="column" marginTop={1}>
          {thisAccount && (
            <>
              <TextField
                label="账户名称"
                defaultValue={getSortedAccountName(thisAccount)}
                margin="normal"
                variant="filled"
              />
              <TextField
                label="账户地址"
                defaultValue={thisAccount?.account.address}
                margin="normal"
                variant="filled"
                multiline
              />
              {!thisAccount.isDevelopment && (
                <Button
                  fullWidth
                  color="secondary"
                  variant="contained"
                  disabled={thisAccount.isDevelopment}
                >
                  删除
                </Button>
              )}
            </>
          )}
        </Box>
      </Container>
    </>
  );
}
