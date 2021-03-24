import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type { BaseProps } from '@@/types';
import { useChain, useNotice } from '@@/hook';
import { Box, List, ListItem, ListItemText, Paper } from '@material-ui/core';
import type { HeaderExtended } from '@polkadot/api-derive';
import { formatNumber } from '@polkadot/util';
import { useRouter } from 'next/router';
import { AccountInfo } from '@components/account';

interface BlockItemProps extends BaseProps {
  value: HeaderExtended;
}

function Item({
  children,
  value: { number, parentHash, extrinsicsRoot, stateRoot, hash, author },
}: BlockItemProps): ReactElement<BlockItemProps> | null {
  const { isChainReady } = useChain();
  const { showError } = useNotice();
  const router = useRouter();

  if (!isChainReady) return null;
  return (
    <Paper>
      <List>
        <ListItem divider>
          <ListItemText
            primary={formatNumber(number.unwrap())}
            primaryTypographyProps={{ color: 'secondary' }}
          />
        </ListItem>
        <ListItem dense>
          <ListItemText
            primary="哈希"
            primaryTypographyProps={{
              color: 'textSecondary',
              variant: 'caption',
            }}
            secondary={hash.toHex()}
            secondaryTypographyProps={{
              color: 'textPrimary',
              variant: 'caption',
              className: 'text-overflow-ellipsis_one_line',
            }}
          />
        </ListItem>
        <ListItem
          dense
          button
          onClick={() => {
            !parentHash.isEmpty && router.push(`/block/${parentHash.toHex()}`);
          }}
        >
          <ListItemText
            primary="父亲/母亲"
            primaryTypographyProps={{
              color: 'textSecondary',
              variant: 'caption',
            }}
            secondary={parentHash.isEmpty ? '/' : parentHash.toHex()}
            secondaryTypographyProps={{
              color: 'textPrimary',
              variant: 'caption',
              className: 'text-overflow-ellipsis_one_line',
            }}
          />
        </ListItem>
        <ListItem dense>
          <ListItemText
            primary="事件"
            primaryTypographyProps={{
              color: 'textSecondary',
              variant: 'caption',
            }}
            secondary={extrinsicsRoot.toHex()}
            secondaryTypographyProps={{
              color: 'textPrimary',
              variant: 'caption',
              className: 'text-overflow-ellipsis_one_line',
            }}
          />
        </ListItem>
        <ListItem dense>
          <ListItemText
            primary="状态"
            primaryTypographyProps={{
              color: 'textSecondary',
              variant: 'caption',
            }}
            secondary={stateRoot.toHex()}
            secondaryTypographyProps={{
              color: 'textPrimary',
              variant: 'caption',
              className: 'text-overflow-ellipsis_one_line',
            }}
          />
        </ListItem>
        {author && <AccountInfo value={author.toString()} onlyItem dense />}
      </List>
    </Paper>
  );
}

export const BlockItem = memo(Item);
