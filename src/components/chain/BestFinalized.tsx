import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type { BaseProps } from '@@/types';
import { useApi, useChain, useNotice, useCall } from '@@/hook';
import { Box } from '@material-ui/core';
import type { BlockNumber } from '@polkadot/types/interfaces';
import { CommonTextField } from './CommonTextField';
import { formatNumber } from '@polkadot/util';

interface BestFinalizedProps extends BaseProps {}

function BestFinalizedBase({
  children,
}: BestFinalizedProps): ReactElement<BestFinalizedProps> | null {
  const { api, isApiReady } = useApi();
  const { isChainReady } = useChain();
  const { showError } = useNotice();

  const value = useCall<BlockNumber>(
    api && isApiReady && api.derive.chain.bestNumberFinalized
  );

  if (!value) return null;
  return (
    <CommonTextField
      id="best_finalized"
      label="最终确定"
      value={formatNumber(value)}
    />
  );
}

export const BestFinalized = memo(BestFinalizedBase);
