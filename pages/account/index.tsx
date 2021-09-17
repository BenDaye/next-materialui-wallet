import { Accounts, ImportAccountButton } from '@components/account';
import { PageHeader } from '@components/common';
import { Toolbar, Box } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { useAccounts } from '@@/hook';
import { Chains } from '@components/wallet';

export default function AccountsPage() {
  const { hasAccount, accounts } = useAccounts();
  const router = useRouter();
  const onSelectAccount = useCallback((info) => {}, []);

  return (
    <>
      <PageHeader title="账户管理" right={<ImportAccountButton />} />
      <Box width={1} display="flex" flexWrap="noWrap" marginTop={0}>
        <Chains />
        <Accounts onSelect={onSelectAccount} toDetails />
      </Box>
      <Toolbar />
    </>
  );
}
