import { useApi, useCall, useChain } from '@@/hook';
import { TextField } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { memo, ReactElement } from 'react';

interface Props {
  id?: string;
  label?: string;
  value?: string | number | null;
  multiline?: boolean;
}

function Common({
  id = `common-${Date.now().toString()}`,
  label = 'Label',
  value = '-',
  multiline = false,
}: Props): ReactElement<Props> {
  const { isChainReady } = useChain();
  if (!isChainReady) {
    return (
      <>
        <Skeleton>
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
            multiline={multiline}
          />
        </Skeleton>
      </>
    );
  }
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
        multiline={multiline}
      />
    </>
  );
}

export default memo(Common);
