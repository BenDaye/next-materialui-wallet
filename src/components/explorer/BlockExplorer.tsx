import { HeaderExtended } from '@polkadot/api-derive';
import { useBlockAuthors } from '@components/polkadot';
import { Box, Container } from '@material-ui/core';
import React, { memo, ReactElement } from 'react';
import { Block } from '.';
import { Children } from '@components/types';

function BlockExplorerProvider({ children }: Children): ReactElement<Children> {
  const { lastHeaders } = useBlockAuthors();
  return (
    <>
      <Container>
        {lastHeaders.map((header: HeaderExtended) => (
          <Box marginY={1} key={header.number.toNumber()}>
            <Block header={header} showMoreIcon isLink />
          </Box>
        ))}
      </Container>
      {children}
    </>
  );
}

export default memo(BlockExplorerProvider);
