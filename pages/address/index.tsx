import { AccountInfoSkeleton } from '@components/account';
import { ImportAddressButton, AddressInfo } from '@components/address';
import { PageHeader } from '@components/common';
import { Toolbar, Box, Container } from '@material-ui/core';
import React, { useMemo } from 'react';
import { useAddresses } from '@components/php/address/hook';
import { ChainList } from '@components/wallet/ChainList';
import styles from '@styles/AccountSelector.module.css';
import { useChain, useCurrentChain } from '@components/php/chain/hook';
import { AddressProps } from '@components/php/address/types';

export default function AddressesPage() {
  const currentChain = useCurrentChain();
  const { hasAddress, addresses } = useAddresses();
  const _addresses = useMemo<AddressProps[]>(
    () =>
      hasAddress && currentChain
        ? addresses.filter((a) => a.chain_type === currentChain.name)
        : [],
    [currentChain, addresses, hasAddress]
  );

  return (
    <>
      <PageHeader title="地址管理" right={<ImportAddressButton />} />
      <Box width={1} display="flex" flexWrap="noWrap" marginTop={0}>
        <ChainList />
        <Box
          flexGrow={1}
          bgcolor="background.default"
          className={styles.content}
          py={1}
        >
          <Container>
            <Box className="width-fill-available">
              {_addresses.length ? (
                _addresses.map((address) => (
                  <Box key={`address: ${address.uuid}`} mb={1}>
                    <AddressInfo value={address} dense />
                  </Box>
                ))
              ) : (
                <AccountInfoSkeleton
                  primary="[尚未添加地址]"
                  secondary="可通过标题栏右侧按钮添加地址"
                />
              )}
            </Box>
          </Container>
        </Box>
      </Box>
      <Toolbar />
    </>
  );
}
