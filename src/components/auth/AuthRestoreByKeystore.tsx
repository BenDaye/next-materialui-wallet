import React, { memo, ReactElement, useEffect, useState } from 'react';
import type { Children } from '@components/types';
import { useForm } from 'react-hook-form';
import { ButtonWithLoading, PageFooter } from '@components/common';
import { Box, Button, Container, TextField, Toolbar } from '@material-ui/core';
import keyring from '@polkadot/ui-keyring';
import { useChain } from '@components/polkadot/hook';
import { KeyringPair } from '@polkadot/keyring/types';
import { useError } from '@components/error';
import { CreateResult } from '@polkadot/ui-keyring/types';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

interface AuthRestoreByKeystoreProps extends Children {}

interface AuthRestoreByKeystoreForm {
  keystore: string;
  password: string;
  name?: string;
}

function createFromJson(value: string): KeyringPair {
  return keyring.createFromJson(JSON.parse(value));
}

function AuthRestoreByKeystore({
  children,
}: AuthRestoreByKeystoreProps): ReactElement<AuthRestoreByKeystoreProps> {
  const { setError } = useError();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit, errors, setValue } = useForm({
    mode: 'onBlur',
  });
  const [pair, setPair] = useState<KeyringPair | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = ({ password }: AuthRestoreByKeystoreForm) => {
    if (!pair) return;
    setLoading(true);

    // TODO: 写进队列里, 防止阻塞
    new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const result: CreateResult = keyring.addPair(pair, password);
          enqueueSnackbar(`账户[${result.json.meta?.name}]导入成功`, {
            variant: 'success',
          });
          router.push('/wallet');
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
          resolve(true);
        }
      }, 100);
    });
  };

  const validKeystore = (value: string): boolean | string => {
    if (!value) return true;
    try {
      setPair(createFromJson(value));
      return true;
    } catch (error) {
      setPair(null);
      return (error as Error).message || 'UNEXPECTED_ERROR';
    }
  };

  useEffect(() => {
    setValue('name', (pair && pair.meta?.name) || '');
  }, [pair]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container>
          <TextField
            name="keystore"
            label="加密 KeyStore(JSON)"
            inputRef={register({
              required: 'KEYSTORE_REQUIRED',
              validate: validKeystore,
            })}
            InputLabelProps={{ shrink: true }}
            variant="filled"
            fullWidth
            margin="normal"
            multiline
            rowsMax={5}
            error={!!errors.keystore}
            helperText={
              errors.keystore?.message ||
              '提供一个备份的JSON文件，用你的账户密码来加密。'
            }
          />
          <TextField
            name="name"
            label="名称"
            inputRef={register}
            InputLabelProps={{ shrink: true }}
            variant="filled"
            fullWidth
            margin="normal"
            disabled
            helperText="此账户的名称，以及它会如何出现在你的地址下。拥有一个链上身份，它就可以被他人使用。"
          />
          <TextField
            name="password"
            label="密码"
            inputRef={register({
              required: 'PASSWORD_REQUIRED',
              validate: (value) =>
                keyring.isPassValid(value) || 'INVALID_PASSWORD',
            })}
            InputLabelProps={{ shrink: true }}
            variant="filled"
            fullWidth
            margin="normal"
            type="password"
            error={!!errors.password}
            helperText={
              errors.password?.message || '之前使用的用于加密此账户的密码。'
            }
          />
        </Container>
        <PageFooter>
          <Toolbar>
            <Box flexGrow={1}>
              <ButtonWithLoading loading={loading}>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  导入
                </Button>
              </ButtonWithLoading>
            </Box>
          </Toolbar>
        </PageFooter>
      </form>
    </>
  );
}

export default memo(AuthRestoreByKeystore);
