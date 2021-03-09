import React, { memo, ReactElement, useCallback, useState } from 'react';
import type { Children } from '@components/types';
import { useApi, useCall, useChain } from '@components/polkadot/hook';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Box, TextField } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import keyring from '@polkadot/ui-keyring';
import { isFunction } from '@polkadot/util';
import type { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { useError } from '@components/error';
import { KeyringJson$Meta } from '@polkadot/ui-keyring/types';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { useSnackbar } from 'notistack';

interface SaveAddressDialogProps extends Children {
  show: boolean;
  onClose: () => void;
}

interface SaveAddressForm {
  address: string;
  name: string;
}

function SaveAddressDialog({
  children,
  show,
  onClose,
}: SaveAddressDialogProps): ReactElement<SaveAddressDialogProps> | null {
  const { api, isApiReady } = useApi();
  const { isChainReady, genesisHash } = useChain();
  const { setError } = useError();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);

  const [address, setAddress] = useState<string | null>(null);
  const info = useCall<DeriveAccountInfo>(
    api &&
      isApiReady &&
      !!address &&
      isFunction(api.derive.accounts.info) &&
      api.derive.accounts.info,
    [address]
  );

  const {
    register,
    handleSubmit,
    watch,
    errors,
    reset,
  } = useForm<SaveAddressForm>({
    mode: 'onBlur',
  });

  const onSubmit = ({ name }: SaveAddressForm) => {
    const _address = info?.accountId?.toString();
    if (!_address) return;
    setLoading(true);
    const meta: KeyringJson$Meta = {
      name: name.trim(),
      genesisHash,
      tags: [],
    };
    try {
      const result: KeyringPair$Json = keyring.saveAddress(_address, meta);
      enqueueSnackbar(`地址[${result.meta?.name}]保存成功`, {
        variant: 'success',
      });
      reset();
      setLoading(false);
      onClose && onClose();
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    onClose && onClose();
  };

  const addressValidate = (value: string): boolean | string => {
    if (!value) return 'ADDRESS_REQUIRED';

    try {
      const publicKey = keyring.decodeAddress(value);
      const isPublicKey = publicKey.length === 32;
      if (!isPublicKey) return 'INVALID_ADDRESS';
      const _address = keyring.encodeAddress(publicKey);
      const isAddressExisting = !!keyring.getAddress(_address);
      if (isAddressExisting) return 'ADDRESS_ALREADY_EXISTED';
      setAddress(_address);
      return true;
    } catch (error) {
      setAddress(null);
      return (error as Error).message || 'UNEXPECTED_ERROR';
    }
  };

  if (!isChainReady) return null;
  return (
    <>
      <Dialog open={show} disableBackdropClick fullWidth>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Box flexGrow={1}>
              <Typography>添加地址</Typography>
            </Box>
          </Toolbar>
        </AppBar>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              name="address"
              label="地址"
              inputRef={register({
                validate: addressValidate,
              })}
              fullWidth
              margin="dense"
              multiline
              rowsMax={3}
              InputLabelProps={{ shrink: true }}
              variant="filled"
              error={!!errors.address}
              helperText={
                errors.address?.message ||
                '把你想要添加到地址簿的联系人地址粘贴到这里。'
              }
              FormHelperTextProps={{
                className: 'word-break',
              }}
            />
            <TextField
              name="name"
              label="名称"
              inputRef={register({
                required: 'NAME_REQUIRED',
              })}
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              variant="filled"
              error={!!errors.name}
              helperText={
                errors.name?.message ||
                '输入联系人的姓名。这个名字在本应用的所有页面内可用。之后可以编辑。'
              }
            />
          </DialogContent>
          <DialogActions>
            <Box flexGrow={1}></Box>
            <Button onClick={handleCancel} color="default">
              取消
            </Button>
            <Button
              color="secondary"
              variant="contained"
              type="submit"
              disabled={loading}
            >
              保存
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default memo(SaveAddressDialog);
