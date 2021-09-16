import { useNotice } from '@@/hook';
import { BaseProps } from '@@/types';
import { useAccount } from '@components/php/account/hook';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';
import CloseIcon from 'mdi-material-ui/Close';
import React, {
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import useFetch from 'use-http';

interface ChangePasswordButtonProps extends BaseProps {
  uuid: string;
}

interface ChangePasswordForm {
  password: string;
  newPassword: string;
  newPasswordConfirm: string;
}

function ChangePasswordButtonBase({
  children,
  uuid,
}: ChangePasswordButtonProps): ReactElement<ChangePasswordButtonProps> {
  const info = useAccount({ uuid });
  const [open, setOpen] = useState<boolean>(false);
  const { register, handleSubmit, errors, getValues, reset } =
    useForm<ChangePasswordForm>({
      mode: 'onBlur',
    });
  const { post, loading } = useFetch('/chain');
  const { showSuccess } = useNotice();

  const onShow = () => setOpen(true);
  const onClose = () => setOpen(false);

  useEffect(() => {
    reset();
  }, [open]);

  const onSubmit = useCallback(
    async ({ password, newPassword }: ChangePasswordForm) => {
      if (!info) return;
      const { status, message } = await post('/changePassword', {
        password,
        new_password: newPassword,
        uuid,
      });
      if (status === 1) {
        setOpen(false);
        showSuccess(message);
      } else {
        reset();
      }
    },
    [uuid]
  );

  const passwordValidate = (value: string): true | string =>
    (value.length >= 8 && value.length <= 32) ||
    '8~32位字符（大小写字母、数字）';

  const passwordConfirmValidate = (value: string): true | string =>
    value === getValues('newPassword') || '密码不一致';

  return (
    <>
      <Button
        fullWidth
        color="default"
        variant="outlined"
        onClick={onShow}
        disabled={loading}
      >
        修改密码
      </Button>
      <Dialog open={open} onClose={onClose} fullScreen>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" onClick={onClose}>
                <CloseIcon />
              </IconButton>
              <Box flexGrow={1}>
                <Typography variant="subtitle1">修改密码</Typography>
              </Box>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <Box height="100%">
              <TextField
                autoFocus
                name="password"
                margin="normal"
                label="原密码"
                type="password"
                fullWidth
                variant="outlined"
                inputRef={register({
                  validate: passwordValidate,
                })}
                InputLabelProps={{ shrink: true }}
                error={!!errors.password}
                helperText={errors.password?.message || '原密码'}
              />
              <TextField
                name="newPassword"
                margin="normal"
                label="新密码"
                type="password"
                fullWidth
                variant="outlined"
                inputRef={register({
                  validate: passwordValidate,
                })}
                InputLabelProps={{ shrink: true }}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message || '新密码'}
              />
              <TextField
                name="newPasswordConfirm"
                margin="normal"
                label="确认密码"
                type="password"
                fullWidth
                variant="outlined"
                inputRef={register({
                  validate: passwordConfirmValidate,
                })}
                InputLabelProps={{ shrink: true }}
                error={!!errors.newPasswordConfirm}
                helperText={errors.newPasswordConfirm?.message || '确认密码'}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Box flexGrow={1}>
              <Toolbar>
                <Button
                  fullWidth
                  color="primary"
                  variant="contained"
                  type="submit"
                  disabled={loading}
                >
                  确认提交
                </Button>
              </Toolbar>
            </Box>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export const ChangePasswordButton = memo(ChangePasswordButtonBase);
