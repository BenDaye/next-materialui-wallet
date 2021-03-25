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
import type { KeyedEvent } from '@components/polkadot/event/types';

interface EventListProps extends BaseProps {
  value: KeyedEvent[];
  showBlock?: boolean;
}

function List({
  children,
  value,
  showBlock = false,
}: EventListProps): ReactElement<EventListProps> {
  const { isChainReady } = useChain();
  const { showError } = useNotice();
  return (
    <>
      {value.map((event, index, array) => (
        <EventListItem
          key={`event-${index}`}
          value={event}
          showBlock={showBlock}
        />
      ))}
    </>
  );
}

export const EventList = memo(List);
