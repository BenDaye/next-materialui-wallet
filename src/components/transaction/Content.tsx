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
import { Box, List, ListItem, ListItemText } from '@material-ui/core';
import type { QueueTx } from '@components/polkadot/queue/types';
import { TransactionFeeProvider } from './Fee';
import { ExtrinsicItem } from '@components/extrinsic';

interface TransactionContentProps extends BaseProps {
  currentItem: QueueTx;
}

function TransactionContent({
  children,
  currentItem: { accountId, extrinsic, isUnsigned, payload },
}: TransactionContentProps): ReactElement<TransactionContentProps> | null {
  const { isChainReady } = useChain();
  const { showError } = useNotice();

  if (!extrinsic || !isChainReady) return null;
  return (
    <Box>
      <ExtrinsicItem extrinsic={extrinsic} defaultExpanded />
      <TransactionFeeProvider accountId={accountId} extrinsic={extrinsic} />
      {children}
    </Box>
  );
}

export const TransactionContentProvider = memo(TransactionContent);
