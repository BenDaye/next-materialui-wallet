import { TextField } from '@material-ui/core';
import React, { memo, ReactElement, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  id?: string;
  label?: string;
  value?: string | number | null;
}

function Common({
  children,
  id = `common-${Date.now().toString()}`,
  label = 'Label',
  value = '-',
}: Props): ReactElement<Props> {
  return (
    <>
      <TextField
        id={id}
        label={label}
        variant="filled"
        color="secondary"
        fullWidth
        margin="dense"
        value={value}
        InputLabelProps={{ shrink: true }}
        inputProps={{ readOnly: true }}
      />
      {children}
    </>
  );
}

export default memo(Common);
