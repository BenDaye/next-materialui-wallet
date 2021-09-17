import { useNotice, useAccount } from '@@/hook';
import { BaseProps } from '@@/types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import useCopy from '@react-hook/copy';
import React, { memo, ReactElement, useEffect, useState } from 'react';
import useFetch from 'use-http';
import { ConfirmPasswordDialog } from './index';

interface ExportButtonProps extends BaseProps {
  text?: string;
  type: 1 | 2;
  uuid: string;
}

function ExportButton({
  children,
  text = '导出',
  uuid,
  type = 1,
}: ExportButtonProps): ReactElement<ExportButtonProps> {
  const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const { copy, copied } = useCopy(result);
  const { showSuccess } = useNotice();
  const { get, loading, response } = useFetch('/chain');
  const info = useAccount({ uuid });

  const onConfirm = async (password: string) => {
    if (!info) return;
    switch (type) {
      case 1:
        {
          const { status, data } = await get(
            `/exportAccount?export_type=1&password=${password}&uuid=${uuid}`
          );
          if (!response.ok) return;
          if (status === 1) {
            setResult(data.mnemonic);
            setShowResult(true);
          }
        }
        break;
      case 2:
        {
          const { status, data } = await get(
            `/exportAccount?export_type=2&password=${password}&uuid=${uuid}`
          );
          if (!response.ok) return;
          if (status === 1) {
            setResult(data.private_key);
            setShowResult(true);
          }
        }
        break;
      default:
        break;
    }
  };

  const handleConfirm = () => {
    copy();
    setShowResult(false);
  };

  useEffect(() => {
    copied && showSuccess('已复制地址到剪贴板');
  }, [copied]);

  return (
    <>
      <Button
        fullWidth
        color="default"
        variant="outlined"
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
      <Dialog open={showResult} onClose={() => setShowResult(false)}>
        <DialogTitle>提示</DialogTitle>
        <DialogContent>
          <Typography className="word-break">{result}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} color="default" disabled={loading}>
            复制
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default memo(ExportButton);
