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
import { EventList } from './List';

interface EventExplorerProps extends BaseProps {}

function Explorer({
  children,
}: EventExplorerProps): ReactElement<EventExplorerProps> {
  const { isChainReady } = useChain();
  const { showError } = useNotice();
  const events = useEvent();
  return (
    <Container>
      <EventList value={events} showBlock />
    </Container>
  );
}

export const EventExplorer = memo(Explorer);
