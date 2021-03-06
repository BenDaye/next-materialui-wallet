import { useApi, useCall } from '@components/polkadot/hook';
import { TextField } from '@material-ui/core';
import React, { memo, ReactElement } from 'react';

interface Props {
  id?: string;
  label?: string;
  value?: string | number | null;
}

function Common({
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
        // inputProps={{ readOnly: true }}
        disabled
      />
    </>
  );
}

export default memo(Common);
