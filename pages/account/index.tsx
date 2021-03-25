import { AccountInfo, AccountInfoSkeleton } from '@components/account';
import { PageHeader } from '@components/common';
import { useAccount } from '@@/hook';
import {
  Toolbar,
  Box,
  Container,
  IconButton,
  Divider,
  List,
  Paper,
} from '@material-ui/core';
import AccountMultiplePlusIcon from 'mdi-material-ui/AccountMultiplePlus';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
import { ImportAccountButton } from '@components/account/ImportButton';

export default function AccountsPage() {
  const { hasAccount, accounts } = useAccount();
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
                      onSelect={() => router.push(`/account/${account}`)}
                      showBadge
                    />
                    {index < array.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
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
