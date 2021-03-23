import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type { ParamProps } from '../types';
import { useChain } from '@@/hook';
import { Box, List, ListItem, ListItemText } from '@material-ui/core';
import { formatBalance } from '@polkadot/util';

function Balance({
  name,
  label,
  value: { isValid, value },
  options,
}: ParamProps): ReactElement<ParamProps> | null {
  const { isChainReady, tokenDecimals, tokenSymbol } = useChain();

  const balance: string = useMemo(() => {
    if (!value) return '0';
    const decimals = options?.decimals || tokenDecimals[0];
    const unit = options?.unit || tokenSymbol[0];
    return formatBalance(value.toString() || 0, {
      withSiFull: true,
      withUnit: unit,
      decimals,
    });
  }, [tokenDecimals, tokenSymbol, value, options]);

  if (!isChainReady) return null;
  return (
    <List disablePadding dense>
      <ListItem disableGutters>
        <ListItemText
          primary={label || name || 'Balance'}
          primaryTypographyProps={{
            variant: 'caption',
            color: 'textSecondary',
          }}
          secondary={balance}
          secondaryTypographyProps={{
            variant: 'body2',
            color: 'textPrimary',
            className: 'word-break',
          }}
          inset
        />
      </ListItem>
    </List>
  );
}

export default memo(Balance);
