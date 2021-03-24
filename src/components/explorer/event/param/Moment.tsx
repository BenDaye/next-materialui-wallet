import React, { memo, ReactElement, useMemo } from 'react';
import type { ParamProps } from '../types';
import { useChain } from '@@/hook';
import { List, ListItem, ListItemText } from '@material-ui/core';

function Moment({
  name,
  label,
  value: { isValid, value },
}: ParamProps): ReactElement<ParamProps> | null {
  const { isChainReady } = useChain();

  const moment: string = useMemo(() => {
    if (!value) return '';
    return new Date(Number(value.toString())).toLocaleString();
  }, [value, isChainReady]);

  if (!isChainReady) return null;
  return (
    <List disablePadding dense>
      <ListItem disableGutters>
        <ListItemText
          primary={label || name || 'Moment'}
          primaryTypographyProps={{
            variant: 'caption',
            color: 'textSecondary',
          }}
          secondary={moment}
          secondaryTypographyProps={{
            variant: 'caption',
            color: 'textPrimary',
            className: 'word-break',
          }}
          inset
        />
      </ListItem>
    </List>
  );
}

export default memo(Moment);
