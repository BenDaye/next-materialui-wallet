import { PageHeader, useNotice } from '@components/common';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useCallback, useMemo } from 'react';
import Container from '@material-ui/core/Container';
import { Box, Button, TextField } from '@material-ui/core';
import { useAccountInfo } from '@components/polkadot/hook';

export default function AddressByAddressPage() {
  const router = useRouter();
  const { address } = router.query;
  const { showSuccess } = useNotice();

  const info = useAccountInfo(typeof address === 'string' ? address : null);

  const isEditable: boolean = useMemo(() => !!info.flags.isEditable, [info]);

  const handleChangeName = useCallback(
    ({ target: { value = '' } }: ChangeEvent<HTMLInputElement>) =>
      info.setName(value),
    [info]
  );

  const onForgetSuccess = () => {
    showSuccess(`地址[${info.name}]删除成功`);
    router.replace('/address');
  };

  const handleClickForget = useCallback(() => info.onForget(onForgetSuccess), [
    info,
  ]);

  return (
    <>
      <PageHeader title="地址详情" />
      <Container>
        <Box display="flex" flexDirection="column" marginTop={1}>
          <>
            {typeof address === 'string' && (
              <TextField
                label="账户地址"
                defaultValue={address}
                margin="normal"
                variant="filled"
                multiline
                disabled
              />
            )}
            {!info.isNull && (
              <>
                <TextField
                  label="账户名称"
                  margin="normal"
                  variant="filled"
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
