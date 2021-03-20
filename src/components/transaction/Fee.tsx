import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type { BaseProps } from '@@/types';
import { useChain, useNotice, useApi } from '@@/hook';
import { Box, TextField } from '@material-ui/core';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import type { RuntimeDispatchInfo } from '@polkadot/types/interfaces';
import { formatBalance, isFunction } from '@polkadot/util';
import { useForm } from 'react-hook-form';
import { Skeleton } from '@material-ui/lab';

interface TransactionFeeProps extends BaseProps {
  accountId?: string | null;
  extrinsic?: SubmittableExtrinsic | null;
}

function TransactionFee({
  children,
  accountId,
  extrinsic,
}: TransactionFeeProps): ReactElement<TransactionFeeProps> | null {
  const { api } = useApi();
  const { isChainReady } = useChain();
  const { showError } = useNotice();
  const { register, setValue } = useForm();
  const [dispatchInfo, setDispatchInfo] = useState<RuntimeDispatchInfo | null>(
    null
  );

  useEffect(() => {
    if (
      !(extrinsic && accountId) ||
      !isFunction(extrinsic.paymentInfo) ||
      !isFunction(api.rpc.payment?.queryInfo)
    )
      return;

    extrinsic
      .paymentInfo(accountId)
      .then((info) => setDispatchInfo(info))
      .catch((err) => showError((err as Error).message));
  }, [api, accountId, extrinsic]);

  useEffect(() => {
    if (dispatchInfo) {
      setValue(
        'fee',
        formatBalance(dispatchInfo?.partialFee, {
          withSiFull: true,
        })
      );
    }
  }, [dispatchInfo]);

  if (!extrinsic || !accountId) return null;
  if (!dispatchInfo) {
    return (
      <Skeleton>
        <TextField
          label="手续费"
          disabled
          margin="dense"
          fullWidth
          variant="filled"
          InputLabelProps={{ shrink: true }}
        />
      </Skeleton>
    );
  }
  return (
    <TextField
      name="fee"
      label="手续费"
      inputRef={register}
      disabled
      margin="dense"
      fullWidth
      variant="filled"
      InputLabelProps={{ shrink: true }}
    />
  );
}

export const TransactionFeeProvider = memo(TransactionFee);
