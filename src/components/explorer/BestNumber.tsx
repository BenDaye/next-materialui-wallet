import { useApi, useCall } from '@components/polkadot/hook';
import type { BlockNumber } from '@polkadot/types/interfaces';
import { formatNumber } from '@polkadot/util';
import { TextField } from '@material-ui/core';
import React, { memo, ReactElement, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  id?: string;
  label?: string;
}

function BestNumber({
  children,
  id = 'best_number',
  label = '最新高度',
}: Props): ReactElement<Props> {
  const { api } = useApi();
  const result = useCall<BlockNumber>(api.derive.chain.bestNumber);
  return (
    <>
      <TextField
        id={id}
        label={label}
        variant="filled"
        color="secondary"
        fullWidth
        margin="dense"
        value={result ? formatNumber(result) : '-'}
        InputLabelProps={{ shrink: true }}
        inputProps={{ readOnly: true }}
      />
      {children}
    </>
  );
}

export default memo(BestNumber);
