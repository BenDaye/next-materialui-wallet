import { Context, createContext } from 'react';
import { EventContextProps } from './types';

export const EventContext: Context<EventContextProps> = createContext<EventContextProps>(
  []
);
