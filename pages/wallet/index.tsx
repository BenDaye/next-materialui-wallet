import { Box, Container, IconButton, Typography } from '@material-ui/core';
import ScanHelperIcon from 'mdi-material-ui/ScanHelper';

import React from 'react';
import { BalanceList } from '@components/wallet';
import { AccountSelector, AccountInfo } from '@components/account';
import { PageHeader } from '@components/common';
import { useAccounts, useCurrentAccount } from '@components/php/account/hook';

export default function WalletPage() {
  const { accounts } = useAccounts();
  const currentAccount = useCurrentAccount(accounts);

  // TODO: 扫码按钮
  return (
    <>
      <PageHeader
        title={
          <Typography variant="subtitle1" align="center">
            钱包
          </Typography>
        }
        showBack={false}
        left={<AccountSelector />}
        right={
          <IconButton edge="end" color="inherit" aria-label="scan">
            <ScanHelperIcon fontSize="small" />
          </IconButton>
        }
      />
      <Container>
        <Box display="flex" flexDirection="column" marginTop={1}>
          <AccountInfo value={currentAccount} showQrcode />
          <Box mt={2}>
            <Typography variant="subtitle1" gutterBottom>
              资产
            </Typography>
          </Box>
          <BalanceList />
        </Box>
      </Container>
    </>
  );
}
