import type { BaseProps } from '@@/types';
import { Backdrop, Box } from '@material-ui/core';
import React, { memo, ReactElement } from 'react';

interface OverlayProps extends BaseProps {}

function Overlay({ children }: OverlayProps): ReactElement<OverlayProps> {
  return (
    <Backdrop open={true}>
      <Box
        width="70%"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        {children}
      </Box>
    </Backdrop>
  );
}

export default memo(Overlay);
