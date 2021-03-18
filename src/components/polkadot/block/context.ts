import { Context, createContext } from 'react';
import type { BlockAuthorContextProps, ValidatorContextProps } from './types';

export const BlockAuthorContext: Context<BlockAuthorContextProps> = createContext<BlockAuthorContextProps>(
  {
    byAuthor: {},
    eraPoints: {},
    lastBlockAuthors: [],
    lastHeaders: [],
  }
);

export const ValidatorContext: Context<ValidatorContextProps> = createContext<ValidatorContextProps>(
  []
);
