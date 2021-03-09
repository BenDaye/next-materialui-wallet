import React, { memo, ReactElement, useCallback, useState } from 'react';
import type { Children } from '@components/types';
import { useChain } from '@components/polkadot/hook';
import { IconButton } from '@material-ui/core';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import SaveAddressDialog from './SaveAddressDialog';

interface SaveAddressButtonProps extends Children {}

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
        <PlaylistAddIcon />
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
