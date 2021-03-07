import { useAccounts } from '@components/polkadot/hook';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Container,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  ListItemAvatar,
} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import Identicon from '@polkadot/react-identicon';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';

export default function AccountsPage() {
  const { hasAccount, sortedAccounts, currentAccount } = useAccounts();
  const router = useRouter();
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" onClick={() => router.back()}>
            <ArrowBackIosIcon />
          </IconButton>
          <Box flexGrow={1}>
            <Typography>账户管理</Typography>
          </Box>
          <IconButton edge="end" onClick={() => router.push('/auth')}>
            <PlaylistAddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container>
        <Box display="flex" flexDirection="column" marginTop={1}>
          <Paper>
            <List>
              {hasAccount &&
                sortedAccounts.map((account, index, array) => (
                  <Fragment key={`account: ${index}`}>
                    <ListItem
                      button
                      selected={currentAccount === account.account.address}
                      onClick={() =>
                        router.push(`/accounts/${account.account.address}`)
                      }
                    >
                      <ListItemAvatar>
                        <Identicon value={account.account.address} size={32} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${account.isDevelopment ? '[TEST] ' : ''}${
                          account.account.meta.name
                        }`}
                        primaryTypographyProps={{ variant: 'button' }}
                        secondary={account.shortAddress}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                    {index < array.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </Fragment>
                ))}
            </List>
          </Paper>
        </Box>
      </Container>
    </>
  );
}
