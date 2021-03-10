import { AccountInfo, AccountInfoSkeleton } from '@components/account';
import { PageHeader } from '@components/common';
import { useAccounts } from '@components/polkadot/hook';
import {
  Toolbar,
  Box,
  Container,
  IconButton,
  Divider,
  List,
  Paper,
} from '@material-ui/core';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';

export default function AccountsPage() {
  const { hasAccount, accounts } = useAccounts();
  const router = useRouter();
  return (
    <>
      <PageHeader
        title="账户管理"
        right={
          <IconButton edge="end" onClick={() => router.push('/auth')}>
            <PlaylistAddIcon />
          </IconButton>
        }
      />
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
