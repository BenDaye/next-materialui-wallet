import React, {
  memo,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from 'react';
import type { BaseProps } from '@@/types';
import { useForm } from 'react-hook-form';
import { Box, Button, Container, TextField, Toolbar } from '@material-ui/core';
import { ButtonWithLoading, PageFooter } from '@components/common';
import { useNotice } from '@@/hook';
import { useRouter } from 'next/router';
import useFetch from 'use-http';
import { saveAccount } from '@components/php/account/helper';
import { useAccounts } from '@components/php/account/hook';

interface RestoreAccountConfirmProps extends BaseProps {
  type: 'mnemonic' | 'private_key';
}

interface RestoreAccountConfirmForm {
  value: string;
  name: string;
  password: string;
  passwordConfirm: string;
}

function Bip({
  children,
  type,
}: RestoreAccountConfirmProps): ReactElement<RestoreAccountConfirmProps> {
  const router = useRouter();
  const { chain } = router.query;
  const chain_type = useMemo((): string => chain?.toString() || '', [chain]);

  const { isAccount, accounts } = useAccounts();
  const { showSuccess, showError } = useNotice();
  const { register, handleSubmit, errors, getValues } =
    useForm<RestoreAccountConfirmForm>({
      mode: 'onBlur',
    });
  const [loading, setLoading] = useState<boolean>(false);
  const { get, post, response } = useFetch('/chain');

  const onSuccess = ({ name, uuid, address }: any): void => {
    saveAccount({ name, uuid, address, chain_type });
    showSuccess(`账户[${name}]已创建`);
    router.back();
  };

  const onError = (err: any): void => {
    showError(err.toString());
    setLoading(false);
  };

  const getAddressByMnemonic = async (
    value: string
  ): Promise<string | null> => {
    try {
      const res = await get(
        `/mnemonicToAddress?mnemonic=${value}&chain_type=${chain_type}`
      );

      if (!res) return null;

      const { status, data, message } = res;

      if (response.ok && status === 1) return data.address;
      onError(message);
      return null;
    } catch (err) {
      showError((err as Error).message);
      return null;
    }
  };

  const getAddressByPrivateKey = async (
    value: string
  ): Promise<string | null> => {
    try {
      const res = await get(
        `/privateToAddress?private_key=${value}&chain_type=${chain_type}`
      );

      if (!res) return null;

      const { status, data, message } = res;

      if (response.ok && status === 1) return data.address;
      onError(message);
      return null;
    } catch (err) {
      showError((err as Error).message);
      return null;
    }
  };

  const isExistedAddress = (value: string | null): boolean => {
    return !value || isAccount(value);
  };

  const onSubmit = useCallback(
    async ({ value, name, password }: RestoreAccountConfirmForm) => {
      setLoading(true);

      const params =
        type === 'mnemonic'
          ? { name, password, mnemonic: value, chain_type }
          : { name, password, private_key: value, chain_type };

      try {
        const address: string | null =
          type === 'mnemonic'
            ? await getAddressByMnemonic(value)
            : await getAddressByPrivateKey(value);

        if (!address) return;
        if (isExistedAddress(address)) return onError('该钱包已存在');

        const res = await post(`/importAccount`, params);

        if (!res) return;

        const { status, data, message } = res;

        if (response.ok && status === 1) return onSuccess(data);
        return onError(message);
      } catch (err) {
        showError((err as Error).message);
      }
    },
    [chain_type]
  );

  const validValue = (value: string): boolean | string => {
    return !!value || '必填';
  };

  const nameValidate = (value: string): true | string => {
    if (!value) return '必填';
    if (accounts.some((a) => a.name === value)) return '该名称已存在';
    return true;
  };

  const passwordValidate = (value: string): true | string =>
    (value.length > 8 && value.length < 32) || '8~32位字符（大小写字母、数字）';

  const passwordConfirmValidate = (value: string): true | string =>
    value === getValues('password') || '密码不一致';

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container>
          <TextField
            name="value"
            label={type === 'mnemonic' ? '助记词' : '私钥种子'}
            inputRef={register({
              validate: validValue,
            })}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            maxRows={5}
            error={!!errors.value}
            helperText={
              errors.value?.message ||
              (type === 'mnemonic' ? '用于备份的助记词' : '用于备份的私钥种子')
            }
          />
          <TextField
            name="name"
            label="名称"
            inputRef={register({ validate: nameValidate })}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={
              errors.name?.message ||
              '此账户的名称，以及它会如何出现在你的地址下。拥有一个链上身份，它就可以被他人使用。'
            }
          />
          <TextField
            name="password"
            label="密码"
            inputRef={register({
              validate: passwordValidate,
            })}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            error={!!errors.password}
            helperText={
              errors.password?.message ||
              '用于此账户的密码和密码确认。当授权任何交易以及加密秘钥对时是必须的。'
            }
          />
          <TextField
            name="passwordConfirm"
            label="确认密码"
            inputRef={register({
              validate: passwordConfirmValidate,
            })}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            error={!!errors.passwordConfirm}
            helperText={
              errors.passwordConfirm?.message ||
              '请确保您使用的是强密码以进行正确的帐户保护。'
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

export const RestoreAccountConfirm = memo(Bip);
