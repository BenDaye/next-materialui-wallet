import React, { memo, ReactElement, useEffect, useState } from 'react';
import type { BaseProps } from '@@/types';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import {
  useAddresses,
  useNotice,
  useChain,
  useCurrentChain,
  useAccounts,
} from '@@/hook';
import { v4 as uuidV4 } from 'uuid';

interface ImportAddressDialogProps extends BaseProps {
  show: boolean;
  onClose: () => void;
}

interface ImportAddressForm {
  address: string;
  name: string;
  chain_type: string;
}

function ImportAddressDialog({
  children,
  show,
  onClose = () => {},
}: ImportAddressDialogProps): ReactElement<ImportAddressDialogProps> | null {
  const { chains } = useChain();
  const currentChain = useCurrentChain();
  const { isAccount } = useAccounts();
  const { updateAddress, isAddress } = useAddresses();
  const { showSuccess, showError, showWarning } = useNotice();
  const [loading, setLoading] = useState<boolean>(false);

  const { register, handleSubmit, errors, reset, clearErrors } =
    useForm<ImportAddressForm>({
      mode: 'onBlur',
    });

  useEffect(() => {
    reset();
    clearErrors();
  }, [show]);

  const onSubmit = ({ name, address, chain_type }: ImportAddressForm) => {
    const _name = name.trim();
    const _address = address.trim();
    if (!_address || !_name || !chain_type) return;

    if (isAccount(_address) || isAddress(_address))
      return showWarning('该地址已存在');
    if (isAccount(_name) || isAddress(_name))
      return showWarning('该名称已存在');

    setLoading(true);
    try {
      updateAddress({
        uuid: uuidV4(),
        name: _name,
        address: _address,
        chain_type,
        activated: false,
      });
      showSuccess(`地址[${_name}]保存成功`);
      reset();
      setLoading(false);
      onClose && onClose();
    } catch (error) {
      showError((error as Error).message);
      setLoading(false);
    }
  };

  const addressValidate = (value: string): boolean | string => {
    if (!value) return 'ADDRESS_REQUIRED';
    return true;
  };

  const handleClose = (_: any, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick') return;
    reset();
    clearErrors();
    onClose();
  };

  if (!chains.length && !currentChain) return null;
  return (
    <>
      <Dialog open={show} fullWidth onClose={handleClose}>
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
              name="chain_type"
              label="链"
              inputRef={register({
                required: '必填',
              })}
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              error={!!errors.chain_type}
              helperText={errors.chain_type?.message || '链'}
              select
              SelectProps={{
                native: true,
              }}
              defaultValue={currentChain?.name}
            >
              {chains.map((chain) => (
                <option key={chain.name} value={chain.name}>
                  {chain.full_name}
                </option>
              ))}
            </TextField>
            <TextField
              name="address"
              label="地址"
              inputRef={register({
                validate: addressValidate,
              })}
              fullWidth
              margin="dense"
              multiline
              maxRows={3}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
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
              variant="outlined"
              error={!!errors.name}
              helperText={
                errors.name?.message ||
                '输入联系人的姓名。这个名字在本应用的所有页面内可用。之后可以编辑。'
              }
            />
          </DialogContent>
          <DialogActions>
            <Box flexGrow={1}></Box>
            <Button onClick={onClose} color="default">
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              保存
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default memo(ImportAddressDialog);
