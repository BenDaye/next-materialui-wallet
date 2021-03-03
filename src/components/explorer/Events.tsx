import { KeyedEvent } from '@components/polkadot/context';
import { Children } from '@components/types';
import React, { memo, ReactElement } from 'react';
import Event from './Event';

interface EventsProps extends Children {
  events?: KeyedEvent[];
}

function Events({ children, events }: EventsProps): ReactElement<EventsProps> {
  return (
    <>
      {events?.map((event) => (
        <Event key={event.key} event={event} />
      ))}
      {children}
    </>
  );
}

export default memo(Events);
