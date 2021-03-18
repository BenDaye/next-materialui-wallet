import { memo, ReactElement, useEffect, useState } from 'react';
import type { BaseProps } from '@@/types';
import { QueueTx, STATUS_COMPLETE } from '@components/polkadot/queue/types';
import { useQueue } from '@@/hook';
import { useNotice } from '@@/hook';

interface TransactionStatusProps extends BaseProps {}

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
  const { showInfo, showError } = useNotice();

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
      if (error || status === 'cancelled') {
        showError(message);
      } else {
        showInfo(message);
      }
    });
  }, [allTx, completedTx]);

  return <>{children}</>;
}

export default memo(TransactionStatus);
