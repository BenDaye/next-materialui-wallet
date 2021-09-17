import { Box, Container } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { PageHeader } from '@components/common';
import {
  ExportAccountButton,
  DeleteAccountButton,
  AddressTextField,
  ChangePasswordButton,
  NameTextField,
} from '@components/account';

export default function AccountByAddressPage() {
  const router = useRouter();
  const { uuid: _uuid } = router.query;
  const uuid = useMemo<string>((): string => _uuid?.toString() || '', [_uuid]);

  return (
    <>
      <PageHeader title="账户详情" />
      <Container>
        <Box display="flex" flexDirection="column" marginTop={1}>
          <AddressTextField uuid={uuid} />
          <NameTextField uuid={uuid} />
          <Box marginY={1}>
            <ChangePasswordButton uuid={uuid} />
          </Box>
          <Box marginBottom={1}>
            <ExportAccountButton text="备份助记词" uuid={uuid} type={1} />
          </Box>
          <Box marginBottom={4}>
            <ExportAccountButton text="备份私钥" uuid={uuid} type={2} />
          </Box>
          <Box marginBottom={1}>
            <DeleteAccountButton text="删除" uuid={uuid} />
          </Box>
        </Box>
      </Container>
    </>
  );
}
