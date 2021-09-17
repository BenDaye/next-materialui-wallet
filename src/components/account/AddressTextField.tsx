import { BaseProps } from '@@/types';
import { useAccount } from '@@/hook';
import { TextField } from '@material-ui/core';
import React, { memo, ReactElement } from 'react';

interface AddressTextFieldProps extends BaseProps {
  uuid: string;
}

function AddressTextField({
  children,
  uuid,
}: AddressTextFieldProps): ReactElement<AddressTextFieldProps> {
  const info = useAccount({ uuid });

  return (
    <TextField
      label="账户地址"
      defaultValue={info?.address}
      margin="normal"
      variant="outlined"
      multiline
      disabled
    />
  );
}

export default memo(AddressTextField);
