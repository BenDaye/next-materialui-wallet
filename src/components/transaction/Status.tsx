import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type { BaseProps } from '@@/types';
import { useQueue, useNotice } from '@@/hook';
import { Box } from '@material-ui/core';
import type { QueueTx } from '@components/polkadot/queue/types';
import { filterTx } from './helper';

interface TransactionStatusProps extends BaseProps {}

function TransactionStatus({
  children,
}: TransactionStatusProps): ReactElement<TransactionStatusProps> {
  const { txqueue } = useQueue();
  const { showError, showInfo, showWarning, showSuccess } = useNotice();
  const [[allTx, completedTx], setTx] = useState<[QueueTx[], QueueTx[]]>([
    [],
    [],
  ]);

  useEffect(() => {
    setTx(filterTx(txqueue));
  }, [txqueue]);

  useEffect(() => {
    allTx.forEach(({ extrinsic, rpc, status, error }) => {
      let { method, section } = rpc;
      if (extrinsic) {
        const meta = extrinsic.registry.findMetaCall(extrinsic.callIndex);
        if (meta.section !== 'unknown') {
          method = meta.method;
          section = meta.section;
        }
      }
      const message = `${status}[${section}.${method}]`;
      if (error) {
        showError(message);
      } else if (status === 'cancelled') {
        showWarning(message);
      } else if (status === 'inblock') {
        showSuccess(message);
      } else {
        showInfo(message);
      }
    });
  }, [allTx, completedTx]);

  return <>{children}</>;
}

export const TransactionStatusProvider = memo(TransactionStatus);
