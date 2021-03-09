import { PageHeader } from '@components/common';
import { useError } from '@components/error';
import { SortedAddress } from '@components/polkadot/context/types';
import { useAddresses, useIsMountedRef } from '@components/polkadot/hook';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import { Box, Button, TextField } from '@material-ui/core';

export default function AddressByAddressPage() {
  const router = useRouter();
  const { address } = router.query;
  const mountedRef = useIsMountedRef();

  const { isAddress, hasAddress, sortedAddresses } = useAddresses();
  const { setError } = useError();
  const [thisAddress, setThisAddress] = useState<SortedAddress | null>(null);

  useEffect(() => {
    let error: Error | null = null;
    if (!address) {
      error = new TypeError('Expected [address], but got undefined');
    } else if (typeof address !== 'string') {
      error = new TypeError(`Expected single [address], but got ${address}`);
    } else if (hasAddress && !isAddress(address)) {
      error = new TypeError(`{address} is not account`);
    }

    if (error) {
      setError(error);
      router.back();
    }
  }, [address, mountedRef, hasAddress, isAddress]);

  useEffect(() => {
    if (typeof address === 'string' && isAddress(address)) {
      const _thisAddress = sortedAddresses.find((v) => v.address === address);
      _thisAddress && setThisAddress(_thisAddress);
    }
  }, [address, hasAddress, sortedAddresses, isAddress]);

  return (
    <>
      <PageHeader title="地址详情" />
      <Container>
        <Box display="flex" flexDirection="column" marginTop={1}>
          {thisAddress && (
            <>
              <TextField
                label="账户名称"
                defaultValue={thisAddress.meta.name}
                margin="normal"
                variant="filled"
              />
              <TextField
                label="账户地址"
                defaultValue={thisAddress.address}
                margin="normal"
                variant="filled"
                multiline
              />
              <Button fullWidth color="secondary" variant="contained">
                删除
              </Button>
            </>
          )}
        </Box>
      </Container>
    </>
  );
}
