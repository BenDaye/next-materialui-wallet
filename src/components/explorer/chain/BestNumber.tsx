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

interface BestNumberProps extends BaseProps {}

function BestNumberBase({
  children,
}: BestNumberProps): ReactElement<BestNumberProps> | null {
  const { api, isApiReady } = useApi();
  const { isChainReady } = useChain();
  const { showError } = useNotice();

  const value = useCall<BlockNumber>(
    api && isApiReady && api.derive.chain.bestNumber
  );

  if (!value) return null;
  return (
    <CommonTextField
      id="best_number"
      label="最新高度"
      value={formatNumber(value)}
    />
  );
}

export const BestNumber = memo(BestNumberBase);
