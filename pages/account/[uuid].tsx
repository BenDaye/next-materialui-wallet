import {
  Box,
  Container,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useNotice } from '@@/hook';
import { PageHeader } from '@components/common';
import { useAccount } from '@components/php/account/hook';
import useFetch from 'use-http';
import { saveAccount } from '@components/php/account/helper';

export default function AccountByAddressPage() {
  const router = useRouter();
  const { uuid: _uuid } = router.query;
  const uuid = useMemo<string>((): string => _uuid?.toString() || '', [_uuid]);
  const info = useAccount({ uuid });
  const [name, setName] = useState<string>(() => (info ? info.name : ''));
  const { post, get, response, loading } = useFetch('/chain');
  const { showSuccess } = useNotice();
  const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] =
    useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [action, setAction] = useState<'EXPORT1' | 'EXPORT2' | 'DELETE'>(
    'DELETE'
  );

  const handleChangeName = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => setName(value);

  const handleChangePassword = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => setPassword(value);

  const handleSaveName = useCallback(async () => {
    if (!info) return;
    const { status } = await post('/changeName', { name, uuid });
    if (!response.ok) return;
    if (status === 1) {
      const { address, chain_type } = info;
      saveAccount({ name, uuid, address, chain_type });
    }
  }, [info]);

  const handleClosePasswordDialog = useCallback(() => {
    setPassword('');
    setShowPasswordDialog(false);
  }, []);

  const handleClickExportMnemonic = useCallback(() => {
    setAction('EXPORT1');
    setShowPasswordDialog(true);
  }, []);
  const handleClickExportPrivateKey = useCallback(() => {
    setAction('EXPORT2');
    setShowPasswordDialog(true);
  }, []);
  const handleClickDelete = useCallback(() => {
    setAction('DELETE');
    setShowPasswordDialog(true);
  }, []);
  const handleClickChangePassword = useCallback(() => {
    setShowResetPasswordDialog(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    setShowPasswordDialog(false);
    if (!info) return;
    switch (action) {
      case 'EXPORT1':
        {
          const { status, data } = await get(
            `/exportAccount?export_type=1&password=${password}&uuid=${uuid}`
          );
        }
        break;
      case 'EXPORT2':
        {
          const { status, data } = await get(
            `/exportAccount?export_type=2&password=${password}&uuid=${uuid}`
          );
        }
        break;
      case 'DELETE':
        {
          const { status, data } = await post(`/deleteAccount`, {
            uuid,
            password,
          });
        }
        break;

      default:
        break;
    }

    setPassword('');
  }, [info]);

  return (
    <>
      <PageHeader title="账户详情" />
      <Container>
        <Box display="flex" flexDirection="column" marginTop={1}>
          <>
            {info && (
              <>
                <TextField
                  label="账户地址"
                  defaultValue={info?.address}
                  margin="normal"
                  variant="outlined"
                  multiline
                  disabled
                />
                <TextField
                  label="账户名称"
                  margin="normal"
                  variant="outlined"
                  value={name}
                  onChange={handleChangeName}
                  onBlur={handleSaveName}
                />
                <Dialog
                  open={showPasswordDialog}
                  onClose={handleClosePasswordDialog}
                >
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
                    <Button
                      onClick={handleConfirm}
                      color="default"
                      disabled={loading}
                    >
                      确认
                    </Button>
                  </DialogActions>
                </Dialog>
                <Box marginY={1}>
                  <Button
                    fullWidth
                    color="default"
                    variant="outlined"
                    onClick={handleClickChangePassword}
                    disabled={loading}
                  >
                    修改密码
                  </Button>
                </Box>
                <Box marginBottom={1}>
                  <Button
                    fullWidth
                    color="default"
                    variant="outlined"
                    onClick={handleClickExportMnemonic}
                    disabled={loading}
                  >
                    备份助记词
                  </Button>
                </Box>
                <Box marginBottom={4}>
                  <Button
                    fullWidth
                    color="default"
                    variant="outlined"
                    onClick={handleClickExportPrivateKey}
                    disabled={loading}
                  >
                    备份私钥
                  </Button>
                </Box>
                <Box marginBottom={1}>
                  <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    onClick={handleClickDelete}
                    disabled={loading}
                  >
                    删除
                  </Button>
                </Box>
              </>
            )}
          </>
        </Box>
      </Container>
    </>
  );
}
