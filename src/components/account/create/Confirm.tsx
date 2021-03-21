import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import type { BaseProps } from '@@/types';
import { useChain, useNotice } from '@@/hook';
import {
  AppBar,
  Box,
  Button,
  Container,
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
} from '@material-ui/core';
import styles from '@styles/Layout.module.css';
import { CreateAccountContextProps } from './types';
import { CreateAccountContext } from './context';
import Identicon from '@polkadot/react-identicon';
import { useForm } from 'react-hook-form';
import keyring from '@polkadot/ui-keyring';
import { createAccount } from './helper';
import { CreateResult } from '@polkadot/ui-keyring/types';
import { useRouter } from 'next/router';

interface CreateAccountConfirmProps extends BaseProps {}

interface ConfirmForm {
  name: string;
  password: string;
  passwordConfirm: string;
}

function Confirm({
  children,
}: CreateAccountConfirmProps): ReactElement<CreateAccountConfirmProps> | null {
  const { isChainReady } = useChain();
  const router = useRouter();
  const { showError, showSuccess } = useNotice();
  const {
    step,
    setStep,
    address,
    seed,
    pairType,
    derivePath,
    meta,
    setMeta,
    password,
    setPassword,
  } = useContext<CreateAccountContextProps>(CreateAccountContext);
  const { register, errors, handleSubmit, getValues } = useForm<ConfirmForm>({
    mode: 'all',
  });
  const [isSending, setIsSending] = useState<boolean>(false);
  const metaName: string = useMemo(() => meta.name || '', [meta]);

  const nameValidate = (value: string): true | string => {
    setMeta({ ...meta, name: value.trim() });
    return !!value || '必填';
  };

  const passwordValidate = (value: string): true | string =>
    keyring.isPassValid(value) || '无效的密码';

  const passwordConfirmValidate = (value: string): true | string =>
    (keyring.isPassValid(value) && value === getValues('password')) ||
    '密码不一致';

  const prevStep = useCallback(() => {
    setStep(3);
  }, []);

  const onSuccess = (result: CreateResult): void => {
    showSuccess(`账户[${result.json.meta.name}]已创建`);
    router.back();
  };

  const onError = (err: Error): void => {
    showError(err.message);
    setIsSending(false);
  };

  const onConfirm = useCallback(
    (form: ConfirmForm) => {
      setPassword(form.password);
      setIsSending(true);
      createAccount(
        seed,
        pairType,
        derivePath,
        meta,
        form.password,
        onSuccess,
        onError
      );
    },
    [seed, pairType, derivePath, meta]
  );

  if (!(step === 4 && isChainReady)) return null;
  return (
    <Fade in={step === 4}>
      <Container>
        <form onSubmit={handleSubmit(onConfirm)}>
          <Paper>
            <List dense>
              <ListItem>
                <ListItemAvatar>
                  <Identicon value={address} size={32} />
                </ListItemAvatar>
                <ListItemText
                  primary={metaName}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondary={address}
                  secondaryTypographyProps={{
                    variant: 'caption',
                    className: 'word-break',
                  }}
                />
              </ListItem>
            </List>
          </Paper>

          <Box mt={2}>
            <TextField
              name="name"
              label="名称"
              inputRef={register({ validate: nameValidate })}
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              variant="filled"
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
              variant="filled"
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
              variant="filled"
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
                disabled={isSending}
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
