import {
  Box,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import AccountMultipleIcon from 'mdi-material-ui/AccountMultiple';
import ContactsIcon from 'mdi-material-ui/Contacts';
import React from 'react';
import { useRouter } from 'next/router';
import { PageHeader } from '@components/common';

export default function SettingsPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title={
          <Typography variant="subtitle1" align="center">
            设置
          </Typography>
        }
        showBack={false}
      />
      <Container>
        <Box display="flex" flexDirection="column" marginTop={1}>
          <Paper>
            <List>
              <ListItem button onClick={() => router.push('/account')}>
                <ListItemIcon>
                  <AccountMultipleIcon />
                </ListItemIcon>
                <ListItemText primary="账户管理" />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem button onClick={() => router.push('/address')}>
                <ListItemIcon>
                  <ContactsIcon />
                </ListItemIcon>
                <ListItemText primary="地址管理" />
              </ListItem>
            </List>
          </Paper>
        </Box>
      </Container>
    </>
  );
}
