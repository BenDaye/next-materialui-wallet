import React, {
  memo,
  ReactElement,
  useState,
  useCallback,
  useContext,
} from 'react';
import type { BaseProps } from '@@/types';
import { useNotice } from '@@/hook';
import {
  AppBar,
  Box,
  Button,
  Container,
  Fade,
  TextField,
  Toolbar,
} from '@material-ui/core';
import styles from '@styles/Layout.module.css';
import { CreateAccountContextProps } from './types';
import { CreateAccountContext } from './context';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import useFetch from 'use-http';
import { saveAccount } from '@components/php/account/helper';
import { ImportAccountResult } from '@components/php/account/types';

interface CreateAccountConfirmProps extends BaseProps {}

interface ConfirmForm {
  name: string;
  password: string;
  passwordConfirm: string;
}

function Confirm({
  children,
}: CreateAccountConfirmProps): ReactElement<CreateAccountConfirmProps> | null {
  const router = useRouter();
  const { showError, showSuccess } = useNotice();
  const { step, setStep, mnemonic, chain_type } =
    useContext<CreateAccountContextProps>(CreateAccountContext);
  const { register, errors, handleSubmit, getValues } = useForm<ConfirmForm>({
    mode: 'all',
  });
  const { loading, post, response } = useFetch();

  const nameValidate = (value: string): true | string => {
    return !!value || '必填';
  };

  const passwordValidate = (value: string): true | string =>
    (value.length >= 8 && value.length <= 32) ||
    '8~32位字符（大小写字母、数字）';

  const passwordConfirmValidate = (value: string): true | string =>
    value === getValues('password') || '密码不一致';

  const prevStep = useCallback(() => {
    setStep(3);
  }, []);

  const onSuccess = ({ name, uuid, address }: ImportAccountResult): void => {
    saveAccount({
      name,
      uuid,
      address,
      chain_type,
      onSuccess: () => {
        showSuccess(`账户[${name}]已创建`);
        router.push('/account');
      },
    });
  };

  const onConfirm = async ({ name, password }: ConfirmForm) => {
    const { status, data } = await post('/chain/importAccount', {
      name,
      password,
      mnemonic,
      chain_type,
    });
    if (!response.ok) return;
    if (status === 1) onSuccess(data);
  };

  if (step !== 4) return null;
  return (
    <Fade in={step === 4}>
      <Container>
        <form onSubmit={handleSubmit(onConfirm)}>
          <Box mt={2}>
            <TextField
              name="name"
              label="名称"
              inputRef={register({ validate: nameValidate })}
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              error={!!errors.name}
              helperText={
                errors.name?.message ||
                '此账户的名称，以及它会如何出现在你的地址下。拥有一个链上身份，它就可以被他人使用。'
              }
            />
            <TextField
              name="password"
              label="密码"
              inputRef={register({ validate: passwordValidate })}
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              error={!!errors.password}
              helperText={
                errors.password?.message ||
                '用于此账户的密码和密码确认。当授权任何交易以及加密秘钥对时是必须的。'
              }
              type="password"
            />
            <TextField
              name="passwordConfirm"
              label="确认密码"
              inputRef={register({ validate: passwordConfirmValidate })}
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              error={!!errors.passwordConfirm}
              helperText={
                errors.passwordConfirm?.message ||
                '请确保您使用的是强密码以进行正确的帐户保护。'
              }
              type="password"
            />
          </Box>

          {children}
          <Toolbar />
          <Toolbar />
          <AppBar
            position="fixed"
            className={styles.bottomNavigation}
            elevation={0}
            color="inherit"
          >
            <Toolbar>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={prevStep}
              >
                上一步
              </Button>
            </Toolbar>
            <Toolbar>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                type="submit"
                disabled={loading}
              >
                创建
              </Button>
            </Toolbar>
          </AppBar>
        </form>
      </Container>
    </Fade>
  );
}

export const CreateAccountConfirm = memo(Confirm);
