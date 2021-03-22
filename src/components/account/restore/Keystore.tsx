import React, { memo, ReactElement, useEffect, useState } from 'react';
import type { BaseProps } from '@@/types';
import { useForm } from 'react-hook-form';
import { ButtonWithLoading, PageFooter } from '@components/common';
import { Box, Button, Container, TextField, Toolbar } from '@material-ui/core';
import keyring from '@polkadot/ui-keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { useNotice } from '@@/hook';
import { CreateResult } from '@polkadot/ui-keyring/types';
import { useRouter } from 'next/router';

interface RestoreAccountByKeystoreProps extends BaseProps {}

interface RestoreAccountByKeystoreForm {
  keystore: string;
  password: string;
  name?: string;
}

function Keystore({
  children,
}: RestoreAccountByKeystoreProps): ReactElement<RestoreAccountByKeystoreProps> {
  const router = useRouter();
  const { showSuccess, showError } = useNotice();
  const { register, handleSubmit, errors, setValue } = useForm({
    mode: 'onBlur',
  });
  const [pair, setPair] = useState<KeyringPair | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async ({ password }: RestoreAccountByKeystoreForm) => {
    if (!pair) return;
    setLoading(true);

    await new Promise((resolve) => {
      try {
        const result: CreateResult = keyring.addPair(pair, password);
        showSuccess(`账户[${result.json.meta?.name}]导入成功`);
        router.push('/wallet');
      } catch (err) {
        showError((err as Error).message);
      } finally {
        setLoading(false);
        resolve(true);
      }
    });
  };

  const keystoreValidate = async (value: string): Promise<true | string> => {
    if (!value) {
      setPair(null);
      return Promise.resolve('keystore_required');
    }
    return await new Promise<true | string>((resolve) => {
      try {
        const result = keyring.createFromJson(JSON.parse(value));
        setPair(result);
        return resolve(true);
      } catch (err) {
        setPair(null);
        return resolve((err as Error).message);
      }
    });
  };

  const passwordValidate = (value: string): true | string =>
    keyring.isPassValid(value) || '无效的密码';

  useEffect(() => {
    if (pair) {
      setValue('name', pair.meta?.name || '');
    }
  }, [pair]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container>
          <TextField
            name="keystore"
            label="加密 KeyStore(JSON)"
            inputRef={register({
              validate: keystoreValidate,
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
              validate: passwordValidate,
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

export const RestoreAccountByKeystore = memo(Keystore);
