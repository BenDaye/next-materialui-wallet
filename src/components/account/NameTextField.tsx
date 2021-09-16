import { BaseProps } from '@@/types';
import { saveAccount } from '@components/php/account/helper';
import { useAccount } from '@components/php/account/hook';
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

function NameTextFieldBase({
  children,
  uuid,
}: NameTextFieldProps): ReactElement<NameTextFieldProps> {
  const info = useAccount({ uuid });
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
      saveAccount({ name, uuid, address, chain_type });
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

export const NameTextField = memo(NameTextFieldBase);
