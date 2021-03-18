import { useEvent } from '@@/hook';
import { Children } from '@components/types';
import { Container } from '@material-ui/core';
import React, { memo, ReactElement } from 'react';
import Events from './Events';

interface EventExplorerProps extends Children {}

function EventExplorerProvider({
  children,
}: EventExplorerProps): ReactElement<EventExplorerProps> {
  const events = useEvent();
  return (
    <>
      <Container>
        <Events events={events} />
        {children}
      </Container>
    </>
  );
}

export default memo(EventExplorerProvider);
