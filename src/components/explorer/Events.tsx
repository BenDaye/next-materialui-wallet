import type { KeyedEvent } from '@components/polkadot/event/types';
import type { BaseProps } from '@@/types';
import React, { memo, ReactElement } from 'react';
import Event from './Event';

interface EventsProps extends BaseProps {
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
