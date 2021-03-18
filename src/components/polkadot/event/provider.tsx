import React, { memo, ReactElement } from 'react';
import type { BaseProps } from '@@/types';
import { EventContext } from './context';
import { useEventSubscription } from './hook';

interface EventProviderProps extends BaseProps {}

function Event({
  children,
}: EventProviderProps): ReactElement<EventProviderProps> {
  const value = useEventSubscription();

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}

export const EventProvider = memo(Event);
