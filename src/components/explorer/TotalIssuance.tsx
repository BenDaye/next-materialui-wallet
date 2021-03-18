import { formatBalance, isFunction } from '@polkadot/util';
import { useApi, useCall } from '@@/hook';
import { TextField } from '@material-ui/core';
import React, { memo, ReactElement } from 'react';
import { Skeleton } from '@material-ui/lab';

interface Props {
  id?: string;
  label?: string;
}

function TotalIssuance({
  id = 'total_issuance',
  label = '总发行量',
}: Props): ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const result = useCall<string>(
    api &&
      isApiReady &&
      isFunction(api.query.balances?.totalIssuance) &&
      api.query.balances?.totalIssuance
  );

  return (
    <>
      {isApiReady ? (
        <TextField
          id={id}
          label={label}
          variant="filled"
          color="secondary"
          fullWidth
          margin="dense"
          value={result ? formatBalance(result, { withSiFull: true }) : '-'}
          InputLabelProps={{ shrink: true }}
          // inputProps={{ readOnly: true }}
          disabled
        />
      ) : (
        <Skeleton>
          <TextField
            label={'label'}
            fullWidth
            margin="dense"
            defaultValue="Skeleton"
            InputLabelProps={{ shrink: true }}
            variant="filled"
          />
        </Skeleton>
      )}
    </>
  );
}

export default memo(TotalIssuance);
