import { useAccounts, useNotice } from '@@/hook';
import { BaseProps } from '@@/types';
import { useAddress, useAddresses } from '@components/php/address/hook';
import { TextField } from '@material-ui/core';
import React, {
  ChangeEvent,
  memo,
  ReactElement,
  useCallback,
  useState,
} from 'react';

interface AddressTextFieldProps extends BaseProps {
  uuid: string;
}

function AddressTextField({
  children,
  uuid,
}: AddressTextFieldProps): ReactElement<AddressTextFieldProps> {
  const { showWarning } = useNotice();
  const info = useAddress({ uuid });
  const { isAccount } = useAccounts();
  const { isAddress, updateAddress } = useAddresses();
  const [address, setAddress] = useState<string>(() => info?.address || '');

  const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
    setAddress(value);

  const handleSave = useCallback(() => {
    if (!info || info.address === address) return;
    if (isAccount(address) || isAddress(address))
      return showWarning('该地址已存在');
    updateAddress({ ...info, address });
  }, [info, address]);

  return (
    <TextField
      label="账户地址"
      value={address}
      margin="normal"
      variant="outlined"
      multiline
      onChange={handleChange}
      onBlur={handleSave}
    />
  );
}

export default memo(AddressTextField);
