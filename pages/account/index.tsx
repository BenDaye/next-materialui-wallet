import { AccountInfo, AccountInfoSkeleton } from '@components/account';
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
import React, { Fragment } from 'react';
import { ImportAccountButton } from '@components/account/ImportButton';
import { useAccounts } from '@components/php/account/hook';

export default function AccountsPage() {
  const { hasAccount, accounts } = useAccounts();
  const router = useRouter();
  return (
    <>
      <PageHeader title="账户管理" right={<ImportAccountButton />} />
      <Container>
        <Box display="flex" flexDirection="column" marginTop={1}>
          {hasAccount ? (
            <Paper>
              <List>
                {accounts.map((account, index, array) => (
                  <Fragment key={`account: ${index}`}>
                    <AccountInfo
                      value={account}
                      onlyItem
                      onSelect={() => router.push(`/account/${account.uuid}`)}
                      showBadge
                    />
                    {index < array.length - 1 && <Divider component="li" />}
                  </Fragment>
                ))}
              </List>
            </Paper>
          ) : (
            <AccountInfoSkeleton />
          )}
        </Box>
      </Container>
      <Toolbar />
    </>
  );
}
