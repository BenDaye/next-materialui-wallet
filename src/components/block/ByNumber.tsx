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
import { Backdrop, Box, CircularProgress } from '@material-ui/core';
import type { Hash } from '@polkadot/types/interfaces';
import { BlockByHash } from './ByHash';

interface BlockByNumberProps extends BaseProps {
  value: number;
}

function ByNumber({
  children,
  value,
}: BlockByNumberProps): ReactElement<BlockByNumberProps> | null {
  const { api } = useApi();
  const { isChainReady } = useChain();
  const [blockHash, setBlockHash] = useState<Hash | null>(null);
  const { showError } = useNotice();

  useEffect(() => {
    if (Number.isNaN(value)) return;

    api.rpc.chain
      .getBlockHash(value)
      .then((res: Hash) => {
        setBlockHash(res);
      })
      .catch((error: Error) => {
        showError(error.message);
      });
  }, [api, isChainReady, value]);

  if (!isChainReady || !blockHash) return null;
  return <BlockByHash value={blockHash.toHex()} />;
}

export const BlockByNumber = memo(ByNumber);
