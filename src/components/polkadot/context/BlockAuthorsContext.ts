import { Context, createContext } from 'react';
import { HeaderExtended } from '@polkadot/api-derive';

export interface Authors {
  byAuthor: Record<string, string>;
  eraPoints: Record<string, string>;
  lastBlockAuthors: string[];
  lastBlockNumber?: string;
  lastHeader?: HeaderExtended;
  lastHeaders: HeaderExtended[];
}

export const BlockAuthorsContext: Context<Authors> = createContext<Authors>({
  byAuthor: {},
  eraPoints: {},
  lastBlockAuthors: [],
  lastHeaders: [],
});

export const ValidatorsContext: Context<string[]> = createContext<string[]>([]);
