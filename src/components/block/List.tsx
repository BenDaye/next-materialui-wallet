import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type { BaseProps } from '@@/types';
import { useChain, useNotice, useBlockAuthor } from '@@/hook';
import {
  Box,
  Container,
  List as MuiList,
  ListItem,
  ListItemText,
  Paper,
} from '@material-ui/core';
import { formatNumber } from '@polkadot/util';
import type { HeaderExtended } from '@polkadot/api-derive';
import { useRouter } from 'next/router';

interface BlockListProps extends BaseProps {
  value: HeaderExtended[];
}

function List({
  children,
  value = [],
}: BlockListProps): ReactElement<BlockListProps> | null {
  const { isChainReady } = useChain();
  const { showError } = useNotice();
  const router = useRouter();

  if (!isChainReady) return null;
  return (
    <MuiList disablePadding>
      {value.map((header: HeaderExtended, index, array) => (
        <ListItem
          button
          key={header.number.toNumber()}
          divider={index < array.length - 1}
          onClick={() => router.push(`/block/${header.hash.toHex()}`)}
        >
          <ListItemText
            primary={formatNumber(header.number.toNumber())}
            primaryTypographyProps={{
              color: 'secondary',
            }}
            secondary={header.hash.toHex()}
            secondaryTypographyProps={{
              className: 'text-overflow-ellipsis_one_line',
              variant: 'caption',
              component: 'p',
            }}
          />
        </ListItem>
      ))}
    </MuiList>
  );
}

export const BlockList = memo(List);
