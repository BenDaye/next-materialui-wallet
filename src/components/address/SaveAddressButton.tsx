import React, { memo, ReactElement, useCallback, useState } from 'react';
import type { BaseProps } from '@@/types';
import { useChain } from '@@/hook';
import { IconButton } from '@material-ui/core';
import AccountMultiplePlusIcon from 'mdi-material-ui/AccountMultiplePlus';
import SaveAddressDialog from './SaveAddressDialog';

interface SaveAddressButtonProps extends BaseProps {}

function SaveAddressButton({
  children,
}: SaveAddressButtonProps): ReactElement<SaveAddressButtonProps> | null {
  const { isChainReady } = useChain();
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = useCallback(() => {
    setOpen(true);
  }, []);

  if (!isChainReady) return null;

  return (
    <>
      <IconButton edge="end" onClick={handleClick} disabled={open}>
        <AccountMultiplePlusIcon />
      </IconButton>
      <SaveAddressDialog
        show={open}
        onClose={() => {
          setOpen(false);
        }}
      />
    </>
  );
}

export default memo(SaveAddressButton);
