import { useNotice } from '@@/hook';
import { BaseProps } from '@@/types';
import { useAddress, useAddresses } from '@components/php/address/hook';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { memo, ReactElement, useCallback, useState } from 'react';

interface DeleteButtonProps extends BaseProps {
  uuid: string;
  text?: string;
}

function DeleteButtonBase({
  children,
  uuid,
  text = '删除账号',
}: DeleteButtonProps): ReactElement<DeleteButtonProps> {
  const router = useRouter();
  const { showSuccess } = useNotice();
  const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(false);
  const { deleteAddress } = useAddresses();
  const info = useAddress({ uuid });

  const onConfirm = useCallback(() => {
    if (!info) return;
    deleteAddress({ uuid });
    showSuccess('该地址已删除');
    router.back();
  }, [info]);

  return (
    <>
      <Button
        fullWidth
        color="primary"
        variant="contained"
        onClick={() => setShowPasswordDialog(true)}
      >
        {text}
      </Button>
      <Dialog
        open={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        fullWidth
      >
        <DialogTitle>提示</DialogTitle>
        <DialogContent>
          <Typography>确认删除此地址？</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)} color="default">
            取消
          </Button>
          <Button onClick={onConfirm} color="default">
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export const DeleteButton = memo(DeleteButtonBase);
