import { useApi, useCall } from '@components/polkadot/hook';
import type { BlockNumber } from '@polkadot/types/interfaces';
import { formatNumber, isFunction } from '@polkadot/util';
import { TextField } from '@material-ui/core';
import React, { memo, ReactElement } from 'react';
import { Skeleton } from '@material-ui/lab';

interface Props {
  id?: string;
  label?: string;
}

function BestFinalized({
  id = 'best_finalized',
  label = '最终确定',
}: Props): ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const result = useCall<BlockNumber>(
    isApiReady &&
      isFunction(api.derive.chain.bestNumberFinalized) &&
      api.derive.chain.bestNumberFinalized
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
          value={result ? formatNumber(result) : '-'}
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

export default memo(BestFinalized);
