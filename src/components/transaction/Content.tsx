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
import { formatMeta } from '@utils/formatMeta';
import { TransactionFeeProvider } from './Fee';
import { TransactionParamsProvider } from './Params';

interface TransactionContentProps extends BaseProps {
  currentItem: QueueTx;
}

function TransactionContent({
  children,
  currentItem: { accountId, extrinsic, isUnsigned, payload },
}: TransactionContentProps): ReactElement<TransactionContentProps> | null {
  const { api } = useApi();
  const { isChainReady } = useChain();
  const { showError } = useNotice();

  const transaction = useMemo(() => {
    if (!extrinsic) return null;
    const { meta, method, section } = extrinsic?.registry.findMetaCall(
      extrinsic.callIndex
    );
    const args = meta?.args.map(({ name }) => name).join(', ') || '';
    return {
      meta,
      method,
      section,
      args,
    };
  }, [extrinsic]);

  const primary = useMemo(
    () =>
      transaction
        ? `${transaction.section}.${transaction.method}(${transaction.args})`
        : '/',
    [transaction]
  );
  const secondary = useMemo(
    () => (transaction ? formatMeta(transaction.meta) : '/'),
    [transaction]
  );

  if (!extrinsic) return null;
  return (
    <Box className="word-break">
      <List disablePadding>
        <ListItem disableGutters divider dense>
          <ListItemText
            primary={primary}
            secondary={secondary}
            secondaryTypographyProps={{ variant: 'caption' }}
          />
        </ListItem>
      </List>
      <TransactionParamsProvider extrinsic={extrinsic} />
      <TransactionFeeProvider accountId={accountId} extrinsic={extrinsic} />
      {children}
    </Box>
  );
}

export const TransactionContentProvider = memo(TransactionContent);
