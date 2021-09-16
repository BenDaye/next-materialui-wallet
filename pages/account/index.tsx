import {
  AccountInfo,
  AccountInfoSkeleton,
  AccountSelectorList,
} from '@components/account';
import { PageHeader } from '@components/common';
import {
  Toolbar,
  Box,
  Container,
  Divider,
  List,
  Paper,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { Fragment, useCallback } from 'react';
import { ImportAccountButton } from '@components/account/ImportButton';
import { useAccounts } from '@components/php/account/hook';
import { ChainList } from '@components/wallet/ChainList';

export default function AccountsPage() {
  const { hasAccount, accounts } = useAccounts();
  const router = useRouter();
  const onSelectAccount = useCallback((info) => {}, []);

  return (
    <>
      <PageHeader title="账户管理" right={<ImportAccountButton />} />
      <Box width={1} display="flex" flexWrap="noWrap" marginTop={0}>
        <ChainList />
        <AccountSelectorList onSelect={onSelectAccount} toDetails />
      </Box>
      <Toolbar />
    </>
  );
}
