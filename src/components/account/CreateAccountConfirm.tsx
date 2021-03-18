import React, {
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import type { BaseProps } from '@@/types';
import { useApi } from '@@/hook';
import {
  AppBar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
  TextField,
  Container,
} from '@material-ui/core';
import styles from '@styles/Layout.module.css';
import { AddressState } from './types';
import Identicon from '@polkadot/react-identicon';
import { useForm } from 'react-hook-form';
import keyring from '@polkadot/ui-keyring';

interface CreateAccountConfirmProps extends BaseProps {
  params: AddressState;
  onConfirm: (data: ConfirmForm) => void;
  onChangeStep: (step: number) => void;
}

interface ConfirmForm {
  name: string;
  password: string;
  passwordConfirm: string;
}

function CreateAccountConfirm({
  children,
  params,
  onConfirm,
  onChangeStep,
}: CreateAccountConfirmProps): ReactElement<CreateAccountConfirmProps> {
  const { api } = useApi();
  const {
    register,
    watch,
    errors,
    clearErrors,
    handleSubmit,
  } = useForm<ConfirmForm>();
  const metaName: string = useMemo(() => watch('name', ''), [watch()]);

  const validPassword = (value: string) =>
    keyring.isPassValid(value) || '无效的密码';
  const validPasswordConfirm = (value: string) =>
    (keyring.isPassValid(value) && value === watch('password')) || '密码不一致';

  const canConfirm: boolean = useMemo(
    () => !!watch('name') && !!watch('password') && !!watch('passwordConfirm'),
    [watch()]
  );

  return (
    <>
      <form onSubmit={handleSubmit(onConfirm)}>
        <Paper>
          <List dense>
            <ListItem>
              <ListItemAvatar>
                <Identicon value={params.address} size={40} />
              </ListItemAvatar>
              <ListItemText
                primary={metaName}
                secondary={params.address}
                secondaryTypographyProps={{ variant: 'caption' }}
                className="word-break"
              />
            </ListItem>
          </List>
        </Paper>
        <Box mt={2}>
          <TextField
            name="name"
            label="名称"
            inputRef={register({ required: true })}
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
            inputRef={register({ validate: validPassword })}
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
            inputRef={register({ validate: validPasswordConfirm })}
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
              onClick={() => onChangeStep(3)}
            >
              上一步
            </Button>
          </Toolbar>
          <Toolbar>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              disabled={!canConfirm}
              type="submit"
            >
              创建
            </Button>
          </Toolbar>
        </AppBar>
      </form>
    </>
  );
}

export default memo(CreateAccountConfirm);
