import React, { memo, ReactElement, useEffect, useState } from 'react';
import type { Children } from '@components/types';
import { useApi, useIsMountedRef } from '@components/polkadot/hook';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import type { RuntimeDispatchInfo } from '@polkadot/types/interfaces';
import { formatBalance, isFunction } from '@polkadot/util';
import { TextField } from '@material-ui/core';
import { useError } from '@components/error';

interface TransactionFeeProps extends Children {
  accountId?: string | null;
  extrinsic?: SubmittableExtrinsic | null;
}

function TransactionFee({
  children,
  accountId,
  extrinsic,
}: TransactionFeeProps): ReactElement<TransactionFeeProps> | null {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const { setError } = useError();

  const [dispatchInfo, setDispatchInfo] = useState<RuntimeDispatchInfo | null>(
    null
  );
  useEffect(() => {
    if (!extrinsic || !accountId) return;

    if (
      accountId &&
      extrinsic &&
      isFunction(extrinsic.paymentInfo) &&
      isFunction(api.rpc.payment?.queryInfo)
    ) {
      extrinsic
        .paymentInfo(accountId)
        .then((info) => mountedRef.current && setDispatchInfo(info))
        .catch(setError);
    }
  }, [api, accountId, extrinsic, mountedRef]);

  if (!extrinsic || !dispatchInfo) {
    return null;
  }

  return (
    <>
      <TextField
        label="手续费"
        defaultValue={
          dispatchInfo &&
          formatBalance(dispatchInfo.partialFee, { withSiFull: true })
        }
        disabled
        margin="dense"
        fullWidth
        variant="filled"
      />
      {children}
    </>
  );
}

export default memo(TransactionFee);
