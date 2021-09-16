import { useAccounts, useAddress, useAddresses, useNotice } from '@@/hook';
import { BaseProps } from '@@/types';
import { TextField } from '@material-ui/core';
import React, {
  ChangeEvent,
  memo,
  ReactElement,
  useCallback,
  useState,
} from 'react';
import useFetch from 'use-http';

interface NameTextFieldProps extends BaseProps {
  uuid: string;
}

function NameTextField({
  children,
  uuid,
}: NameTextFieldProps): ReactElement<NameTextFieldProps> {
  const { showWarning } = useNotice();
  const info = useAddress({ uuid });
  const { isAccount } = useAccounts();
  const { updateAddress, isAddress } = useAddresses();
  const [name, setName] = useState<string>(() => (info ? info.name : ''));

  const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
    setName(value);

  const handleSave = useCallback(() => {
    if (!info || info.name === name) return;
    if (isAccount(name) || isAddress(name)) return showWarning('该名称已存在');
    updateAddress({ ...info, name });
  }, [info, name]);

  return (
    <TextField
      label="账户名称"
      margin="normal"
      variant="outlined"
      value={name}
      onChange={handleChange}
      onBlur={handleSave}
    />
  );
}

export default memo(NameTextField);
