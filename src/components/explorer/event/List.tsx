import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type { BaseProps } from '@@/types';
import { useChain, useNotice, useEvent } from '@@/hook';
import { Box, Container } from '@material-ui/core';
import { EventListItem } from './ListItem';

interface EventExplorerProps extends BaseProps {}

function Explorer({
  children,
}: EventExplorerProps): ReactElement<EventExplorerProps> {
  const { isChainReady } = useChain();
  const { showError } = useNotice();
  const events = useEvent();
  return (
    <Container>
      {events.map((event, index, array) => (
        <EventListItem key={`event-${index}`} value={event} />
      ))}
    </Container>
  );
}

export const EventExplorer = memo(Explorer);
