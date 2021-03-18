import React, { memo, ReactElement } from 'react';
import { Children } from '@components/types';
import { EventContext } from './context';
import { useEventSubscription } from './hook';

interface EventProviderProps extends Children {}

function Event({
  children,
}: EventProviderProps): ReactElement<EventProviderProps> {
  const value = useEventSubscription();

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}

export const EventProvider = memo(Event);
