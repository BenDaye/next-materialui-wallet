import { Context, createContext } from 'react';
import type { BlockNumber, EventRecord } from '@polkadot/types/interfaces';

export interface IndexedEvent {
  indexes: number[];
  record: EventRecord;
}

export interface KeyedEvent extends IndexedEvent {
  blockHash?: string;
  blockNumber?: BlockNumber;
  key: string;
}

export type EventsProps = KeyedEvent[];

export const EventsContext: Context<EventsProps> = createContext<EventsProps>(
  []
);
