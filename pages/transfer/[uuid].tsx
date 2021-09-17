import { useNotice, useAccounts, useAddresses } from '@@/hook';
import { AccountInfo, ConfirmPasswordDialog } from '@components/account';
import {} from '@components/account';
import { PageHeader } from '@components/common';
import { AddressProps } from '@components/php/address/types';
import {
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import useFetch from 'use-http';

interface TransferForm {
  to_address: string;
  call_value: string;
}

export default function TransferPage() {
  const router = useRouter();
  const { uuid: _uuid } = router.query;
  const uuid = useMemo<string>((): string => _uuid?.toString() || '', [_uuid]);

  const { post, response, loading } = useFetch('/chain');

  const { accounts } = useAccounts();
  const { addresses } = useAddresses();
  const [toAddress, setToAddress] = useState<AddressProps>();

  const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(false);

  const currentAccount = useMemo(
    () => accounts.find((a) => a.uuid === uuid),
    [uuid, accounts]
  );

  const { register, handleSubmit, errors, getValues, reset } =
    useForm<TransferForm>({
      mode: 'onBlur',
    });

  const { showSuccess } = useNotice();

  const onSubmit = useCallback(
    () => setShowPasswordDialog(true),
    [uuid, currentAccount]
  );

  const onConfirm = async (password: string) => {
    const { status, data } = await post('/transfer', {
      uuid,
      chain_type: currentAccount?.chain_type,
      from_address: currentAccount?.address,
      to_address: getValues('to_address'),
      call_value: getValues('call_value'),
      password,
    });
    if (!response.ok) return;
    if (status === 1) {
      reset();
      showSuccess(data.toString());
      router.replace('/wallet');
    }
  };

  return (
    <>
      <PageHeader title={`${currentAccount?.chain_type}转账`} />
      <Container>
        <Box mt={1}>
          <AccountInfo value={currentAccount} showBalance />
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Autocomplete
            options={addresses}
            getOptionLabel={(option) => `${option.name} ${option.address}`}
            getOptionDisabled={(option) => !!option.activated}
            freeSolo
            fullWidth
            blurOnSelect
            selectOnFocus
            onChange={(_, address: AddressProps) => setToAddress(address)}
            renderInput={(params) => (
              <TextField
                {...params}
                name="to_address"
                inputRef={register({ required: '必填' })}
                label="转入账号"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.to_address}
                helperText={errors.to_address?.message || '转入账号'}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
          <TextField
            name="call_value"
            label="转账金额"
            inputRef={register({ required: '必填', min: 0 })}
            variant="outlined"
            margin="normal"
            fullWidth
            type="number"
            InputLabelProps={{ shrink: true }}
            error={!!errors.call_value}
            helperText={errors.call_value?.message || '转账金额'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {currentAccount?.chain_type || ''}
                </InputAdornment>
              ),
            }}
          />
          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              type="submit"
              disabled={loading}
            >
              提交
            </Button>
            <ConfirmPasswordDialog
              open={showPasswordDialog}
              onClose={() => setShowPasswordDialog(false)}
              onConfirm={onConfirm}
            />
          </Box>
        </form>
      </Container>
    </>
  );
}
