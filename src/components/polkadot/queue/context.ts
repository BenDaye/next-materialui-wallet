import { Context, createContext } from 'react';
import { defaultQueue } from './helper';
import type { QueueContextProps } from './types';

export const QueueContext: Context<QueueContextProps> = createContext<QueueContextProps>(
  defaultQueue as QueueContextProps
);
