import { BaseProps } from '@@/types';
import { useAccount, useAccounts } from '@@/hook';
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
  const info = useAccount({ uuid });
  const { updateAccount } = useAccounts();
  const [name, setName] = useState<string>(() => (info ? info.name : ''));
  const { post, response, loading } = useFetch('/chain');

  const handleChangeName = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => setName(value);

  const handleSaveName = useCallback(async () => {
    if (!info) return;
    const { status } = await post('/changeName', { name, uuid });
    if (!response.ok) return;
    if (status === 1) {
      const { address, chain_type } = info;
      updateAccount({ name, uuid, address, chain_type });
    }
  }, [info, name]);

  return (
    <TextField
      label="账户名称"
      margin="normal"
      variant="outlined"
      value={name}
      onChange={handleChangeName}
      onBlur={handleSaveName}
      disabled={loading}
    />
  );
}

export default memo(NameTextField);
