import { Box, Container, TextField, Button } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAccountFullByAddress, useNotice } from '@@/hook';
import type { AccountFullProps } from '@components/polkadot/account/types';
import { PageHeader } from '@components/common';

export default function AccountByAddressPage() {
  const router = useRouter();
  const { address } = router.query;
  const { showSuccess } = useNotice();

  const info: AccountFullProps = useAccountFullByAddress(
    typeof address === 'string' ? address : null
  );

  const isEditable: boolean = useMemo(() => !!info.flags.isEditable, [info]);

  const handleChangeName = useCallback(
    ({ target: { value = '' } }: ChangeEvent<HTMLInputElement>) =>
      info.setName(value),
    [info]
  );

  const onForgetSuccess = () => {
    showSuccess(`账户[${info.name}]删除成功`);
    router.replace('/account');
  };

  const handleClickForget = useCallback(
    () => info.onForget(onForgetSuccess),
    [info]
  );

  return (
    <>
      <PageHeader title="账户详情" />
      <Container>
        <Box display="flex" flexDirection="column" marginTop={1}>
          <>
            {typeof address === 'string' && (
              <TextField
                label="账户地址"
                defaultValue={address}
                margin="normal"
                variant="outlined"
                multiline
                disabled
              />
            )}
            {!info.isNull && (
              <>
                <TextField
                  label="账户名称"
                  margin="normal"
                  variant="outlined"
                  value={info.name}
                  onChange={handleChangeName}
                  onBlur={info.onSaveName}
                  disabled={!isEditable}
                />
                <Button
                  fullWidth
                  color="secondary"
                  variant="contained"
                  disabled={!isEditable}
                  onClick={handleClickForget}
                >
                  删除
                </Button>
              </>
            )}
          </>
        </Box>
      </Container>
    </>
  );
}
