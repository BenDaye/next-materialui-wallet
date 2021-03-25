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

function Unknown({
  name,
  label,
  value: { isValid, value },
}: ParamProps): ReactElement<ParamProps> | null {
  const { isChainReady } = useChain();

  if (!isChainReady) return null;
  return (
    <List disablePadding dense>
      <ListItem disableGutters>
        <ListItemText
          primary={label || name || 'Unknown'}
          primaryTypographyProps={{
            variant: 'caption',
            color: 'textSecondary',
          }}
          // TODO: 格式化json
          secondary={value.toString()}
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

export default memo(Unknown);
