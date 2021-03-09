import { Context, createContext } from 'react';
import { Authors } from './types';

export const BlockAuthorsContext: Context<Authors> = createContext<Authors>({
  byAuthor: {},
  eraPoints: {},
  lastBlockAuthors: [],
  lastHeaders: [],
});

export const ValidatorsContext: Context<string[]> = createContext<string[]>([]);
