import SaveAddressButton from '@components/address/SaveAddressButton';
import { useAddresses } from '@components/polkadot/hook';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Container,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Divider,
  ListItemText,
} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Identicon from '@polkadot/react-identicon';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';

export default function AddressesPage() {
  const { hasAddress, sortedAddresses } = useAddresses();
  const router = useRouter();

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" onClick={() => router.back()}>
            <ArrowBackIosIcon />
          </IconButton>
          <Box flexGrow={1}>
            <Typography>地址管理</Typography>
          </Box>
          <SaveAddressButton />
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container>
        <Box display="flex" flexDirection="column" marginTop={1}>
          <Paper>
            <List>
              {hasAddress &&
                sortedAddresses.map((address, index, array) => (
                  <Fragment key={`address: ${index}`}>
                    <ListItem
                      button
                      onClick={() =>
                        router.push(`/addresses/${address.address}`)
                      }
                    >
                      <ListItemAvatar>
                        <Identicon value={address.address} size={32} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={address.meta.name}
                        primaryTypographyProps={{ variant: 'button' }}
                        secondary={address.shortAddress}
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
      <Toolbar />
    </>
  );
}
