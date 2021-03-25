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
import { formatBalance } from '@polkadot/util';

interface TotalIssuanceProps extends BaseProps {}

function TotalIssuanceBase({
  children,
}: TotalIssuanceProps): ReactElement<TotalIssuanceProps> | null {
  const { api, isApiReady } = useApi();
  const { isChainReady } = useChain();
  const { showError } = useNotice();

  const value = useCall<string>(
    api && isApiReady && api.query.balances?.totalIssuance
  );

  if (!value) return null;
  return (
    <CommonTextField
      id="total_issuance"
      label="总发行量"
      value={formatBalance(value || 0, { withSiFull: true })}
    />
  );
}

export const TotalIssuance = memo(TotalIssuanceBase);
