import { Button } from '@material-ui/core';
import React, { memo, ReactElement } from 'react';
import { useSetting } from '../hook';

function SwitchNodeButtonBase(): ReactElement {
  const { showNodeDialogAction } = useSetting();
  return (
    <Button variant="contained" onClick={showNodeDialogAction}>
      切换节点
    </Button>
  );
}

export const SwitchNodeButton = memo(SwitchNodeButtonBase);
