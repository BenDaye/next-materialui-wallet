import { useNotice } from '@@/hook';
import { BaseProps } from '@@/types';
import { useAccount, useAccounts } from '@components/php/account/hook';
import { Button } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { memo, ReactElement, useCallback, useState } from 'react';
import useFetch from 'use-http';
import { ConfirmPasswordDialog } from './ConfirmPassword';

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
  const { post, loading, response } = useFetch('/chain');
  const { deleteAccount } = useAccounts();
  const info = useAccount({ uuid });

  const onConfirm = useCallback(
    async (password: string) => {
      if (!info) return;
      const { status, message } = await post(`/deleteAccount`, {
        uuid,
        password: password,
      });
      if (!response.ok) return;
      if (status === 1) {
        deleteAccount({ uuid });
        showSuccess(message);
        router.back();
      }
    },
    [info]
  );

  return (
    <>
      <Button
        fullWidth
        color="primary"
        variant="contained"
        onClick={() => setShowPasswordDialog(true)}
        disabled={loading}
      >
        {text}
      </Button>
      <ConfirmPasswordDialog
        open={showPasswordDialog}
        loading={loading}
        onClose={() => setShowPasswordDialog(false)}
        onConfirm={onConfirm}
      />
    </>
  );
}

export const DeleteButton = memo(DeleteButtonBase);
