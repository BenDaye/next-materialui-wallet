import React, { memo, ReactElement, useMemo } from 'react';
import type { Children } from '@components/types';
import { useApi } from '@components/polkadot/hook';
import { QueueTx } from '@components/polkadot/context';
import { Box, List, ListItem, ListItemText } from '@material-ui/core';
import { formatMeta } from '@utils/formatMeta';
import TransactionParams from './TransactionParams';
import { TransactionFee } from '.';

interface TransactionProps extends Children {
  currentItem: QueueTx;
}

function Transaction({
  children,
  currentItem: { accountId, extrinsic, isUnsigned, payload },
}: TransactionProps): ReactElement<TransactionProps> | null {
  const { api } = useApi();
  if (!extrinsic) {
    return null;
  }

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

  return (
    <>
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
        <TransactionParams extrinsic={extrinsic} />
        <TransactionFee accountId={accountId} extrinsic={extrinsic} />
      </Box>
      {children}
    </>
  );
}

export default memo(Transaction);
