import React, { memo, ReactElement } from 'react';
import type { BaseProps } from '@@/types';
import { useAccounts } from '@@/hook';
import { Box, IconButton } from '@material-ui/core';
import AccountMultiplePlusIcon from 'mdi-material-ui/AccountMultiplePlus';

interface ImportAccountButtonProps extends BaseProps {
  edge?: 'start' | 'end' | false;
}

function ImportAccountButtonBase({
  children,
  edge = 'end',
}: ImportAccountButtonProps): ReactElement<ImportAccountButtonProps> {
  const { importAccount } = useAccounts();

  return (
    <>
      {children ? (
        <Box onClick={importAccount}>{children}</Box>
      ) : (
        <IconButton edge={edge} onClick={importAccount}>
          <AccountMultiplePlusIcon />
        </IconButton>
      )}
    </>
  );
}

export const ImportAccountButton = memo(ImportAccountButtonBase);
