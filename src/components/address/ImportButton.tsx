import React, { memo, ReactElement } from 'react';
import type { BaseProps } from '@@/types';
import { Box, IconButton } from '@material-ui/core';
import AccountMultiplePlusIcon from 'mdi-material-ui/AccountMultiplePlus';
import { useAddresses } from '@@/hook';

interface ImportAddressButtonProps extends BaseProps {}

function ImportAddressButton({
  children,
}: ImportAddressButtonProps): ReactElement<ImportAddressButtonProps> {
  const { importAddress } = useAddresses();

  return (
    <>
      {children ? (
        <Box onClick={importAddress}>{children}</Box>
      ) : (
        <IconButton edge="end" onClick={importAddress}>
          <AccountMultiplePlusIcon />
        </IconButton>
      )}
    </>
  );
}

export default memo(ImportAddressButton);
