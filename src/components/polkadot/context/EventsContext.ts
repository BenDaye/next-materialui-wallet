import { Context, createContext } from 'react';
import { EventsProps } from './types';

export const EventsContext: Context<EventsProps> = createContext<EventsProps>(
  []
);
