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
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import Identicon from '@polkadot/react-identicon';

function Account({
  name,
  label,
  value: { isValid, value },
}: ParamProps): ReactElement<ParamProps> | null {
  const { isChainReady } = useChain();

  if (!isChainReady) return null;
  return (
    <List disablePadding dense>
      <ListItem disableGutters>
        <ListItemAvatar>
          <Identicon value={value.toString()} size={32} />
        </ListItemAvatar>
        <ListItemText
          primary={label || name || 'Account'}
          primaryTypographyProps={{
            variant: 'caption',
            color: 'textSecondary',
          }}
          secondary={value.toString()}
          secondaryTypographyProps={{
            variant: 'caption',
            color: 'textPrimary',
            className: 'word-break',
          }}
        />
      </ListItem>
    </List>
  );
}

export default memo(Account);
