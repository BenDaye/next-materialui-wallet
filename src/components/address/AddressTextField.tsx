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
  const info = useAddress({ uuid });
  const { addresses, updateAddress } = useAddresses();
  const [address, setAddress] = useState<string>(() => info?.address || '');

  const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
    setAddress(value);

  const handleSave = useCallback(() => {
    if (!info) return;
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
