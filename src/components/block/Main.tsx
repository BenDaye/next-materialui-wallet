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
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@material-ui/core';
import { formatNumber } from '@polkadot/util';
import type { HeaderExtended } from '@polkadot/api-derive';
import { useRouter } from 'next/router';
import { BlockList } from './List';

interface BlockExplorerProps extends BaseProps {}

function Explorer({
  children,
}: BlockExplorerProps): ReactElement<BlockExplorerProps> | null {
  const { isChainReady } = useChain();
  const { showError } = useNotice();
  const { lastHeaders } = useBlockAuthor();
  const router = useRouter();

  if (!isChainReady) return null;
  return (
    <Container>
      <Paper>
        <BlockList value={lastHeaders} />
      </Paper>
    </Container>
  );
}

export const BlockExplorer = memo(Explorer);
