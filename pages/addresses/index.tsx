import { useAddresses } from '@components/polkadot/hook';
import { AppBar, Toolbar, Box, Typography, Container } from '@material-ui/core';
import React from 'react';

export default function AddressesPage() {
  const { addresses, hasAddress } = useAddresses();

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Box flexGrow={1}>
            <Typography>地址管理</Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container>
        <Box display="flex" flexDirection="column" marginTop={1}></Box>
      </Container>
    </>
  );
}
