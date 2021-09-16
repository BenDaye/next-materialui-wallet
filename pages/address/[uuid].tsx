import { PageHeader } from '@components/common';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import Container from '@material-ui/core/Container';
import { Box } from '@material-ui/core';
import { AddressTextField, NameTextField } from '@components/address';
import { DeleteButton } from '@components/address/DeleteButton';

export default function AddressByAddressPage() {
  const router = useRouter();
  const { uuid: _uuid } = router.query;
  const uuid = useMemo<string>((): string => _uuid?.toString() || '', [_uuid]);

  return (
    <>
      <PageHeader title="地址详情" />
      <Container>
        <Box display="flex" flexDirection="column" marginTop={1}>
          <AddressTextField uuid={uuid} />
          <NameTextField uuid={uuid} />
          <Box mt={4}>
            <DeleteButton uuid={uuid} text="删除地址" />
          </Box>
        </Box>
      </Container>
    </>
  );
}
