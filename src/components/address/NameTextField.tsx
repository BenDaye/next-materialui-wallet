import { BaseProps } from '@@/types';
import { saveAccount } from '@components/php/account/helper';
import { useAccount } from '@components/php/account/hook';
import { useAddress, useAddresses } from '@components/php/address/hook';
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
  const info = useAddress({ uuid });
  const { updateAddress } = useAddresses();
  const [name, setName] = useState<string>(() => (info ? info.name : ''));

  const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
    setName(value);

  const handleSave = useCallback(async () => {
    if (!info) return;
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
