import { BaseProps } from '@@/types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@material-ui/core';
import React, {
  ChangeEvent,
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';

interface ConfirmPasswordProps extends BaseProps {
  open: boolean;
  onClose: Function;
  onConfirm: Function;
  loading?: boolean;
}

function ConfirmPasswordDialog({
  children,
  open = false,
  onClose,
  onConfirm,
  loading = false,
}: ConfirmPasswordProps): ReactElement<ConfirmPasswordProps> {
  const [password, setPassword] = useState<string>('');

  const handleChangePassword = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => setPassword(value);

  const handleClosePasswordDialog = () => onClose();

  const handleConfirm = () => {
    onConfirm(password);
    onClose();
  };

  useEffect(() => {
    setPassword('');
  }, [open]);

  return (
    <>
      <Dialog open={open} onClose={handleClosePasswordDialog}>
        <DialogTitle>提示</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="密码"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={handleChangePassword}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog} color="default">
            取消
          </Button>
          <Button onClick={handleConfirm} color="default" disabled={loading}>
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default memo(ConfirmPasswordDialog);
