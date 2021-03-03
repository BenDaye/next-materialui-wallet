import { formatBalance } from '@polkadot/util';
import { useApi, useCall, useChain } from '@components/polkadot/hook';
import { TextField } from '@material-ui/core';
import React, { memo, ReactElement, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  id?: string;
  label?: string;
}

function TotalIssuance({
  children,
  id = 'total_issuance',
  label = '总发行量',
}: Props): ReactElement<Props> {
  const { api } = useApi();
  const result = useCall<string>(api.query.balances?.totalIssuance);

  return (
    <>
      <TextField
        id={id}
        label={label}
        variant="filled"
        color="secondary"
        fullWidth
        margin="dense"
        value={result ? formatBalance(result, { withSiFull: true }) : '-'}
        InputLabelProps={{ shrink: true }}
        inputProps={{ readOnly: true }}
      />
      {children}
    </>
  );
}

export default memo(TotalIssuance);
