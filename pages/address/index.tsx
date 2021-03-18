import { AccountInfo, AccountInfoSkeleton } from '@components/account';
import SaveAddressButton from '@components/address/SaveAddressButton';
import { PageHeader } from '@components/common';
import { useAddress } from '@@/hook';
import {
  Toolbar,
  Box,
  Container,
  Paper,
  List,
  Divider,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';

export default function AddressesPage() {
  const { hasAddress, addresses } = useAddress();
  const router = useRouter();
  return (
    <>
      <PageHeader title="地址管理" right={<SaveAddressButton />} />
      <Container>
        <Box display="flex" flexDirection="column" marginTop={1}>
          {hasAddress ? (
            <Paper>
              <List>
                {addresses.map((address, index, array) => (
                  <Fragment key={`account: ${index}`}>
                    <AccountInfo
                      value={address}
                      onlyItem
                      onSelect={() => router.push(`/address/${address}`)}
                    />
                    {index < array.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </Fragment>
                ))}
              </List>
            </Paper>
          ) : (
            <AccountInfoSkeleton
              primary="[尚未添加地址]"
              secondary="可通过标题栏右侧按钮添加地址"
            />
          )}
        </Box>
      </Container>
      <Toolbar />
    </>
  );
}
