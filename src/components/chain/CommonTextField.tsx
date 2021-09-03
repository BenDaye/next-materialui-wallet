import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type { BaseProps } from '@@/types';
import { useChain, useNotice } from '@@/hook';
import { Box, TextField } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

interface CommonTextFieldProps extends BaseProps {
  id?: string;
  label?: string;
  value?: string | number | null;
  multiline?: boolean;
}

function Common({
  children,
  id = `common-${Date.now().toString()}`,
  label = 'Label',
  value = '-',
  multiline = false,
}: CommonTextFieldProps): ReactElement<CommonTextFieldProps> {
  const { isChainReady } = useChain();
  if (!isChainReady) {
    return (
      <Skeleton>
        <TextField
          id={id}
          label={label}
          variant="outlined"
          color="secondary"
          fullWidth
          margin="dense"
          value={value}
          InputLabelProps={{ shrink: true }}
          disabled
          multiline={multiline}
        />
      </Skeleton>
    );
  }
  return (
    <TextField
      id={id}
      label={label}
      variant="outlined"
      color="secondary"
      fullWidth
      margin="dense"
      value={value}
      InputLabelProps={{ shrink: true }}
      disabled
      multiline={multiline}
    />
  );
}

export const CommonTextField = memo(Common);
