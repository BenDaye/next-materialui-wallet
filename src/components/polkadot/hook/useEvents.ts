import { EventsContext, EventsProps } from '@components/polkadot/context';
import { useContext } from 'react';

export const useEvent = (): EventsProps => useContext(EventsContext);
