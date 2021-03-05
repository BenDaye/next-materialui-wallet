import { memo, ReactElement, useEffect, useState } from 'react';
import type { Children } from '@components/types';
import { QueueTx, STATUS_COMPLETE } from '@components/polkadot/context';
import { useQueue } from '@components/polkadot/hook/useQueue';
import { useSnackbar } from 'notistack';

interface TransactionStatusProps extends Children {}

function filterTx(txqueue?: QueueTx[]): [QueueTx[], QueueTx[]] {
  const allTx = (txqueue || []).filter(
    ({ status }) => !['completed', 'incomplete'].includes(status)
  );

  return [
    allTx,
    allTx.filter(({ status }) => STATUS_COMPLETE.includes(status)),
  ];
}

function TransactionStatus({
  children,
}: TransactionStatusProps): ReactElement<TransactionStatusProps> {
  const { txqueue } = useQueue();
  const [[allTx, completedTx], setAllTx] = useState<[QueueTx[], QueueTx[]]>([
    [],
    [],
  ]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setAllTx(filterTx(txqueue));
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
      enqueueSnackbar(message, {
        variant: error || status === 'cancelled' ? 'error' : 'info',
      });
    });
  }, [allTx, completedTx]);

  return <>{children}</>;
}

export default memo(TransactionStatus);
