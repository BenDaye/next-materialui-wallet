import { Context, createContext } from 'react';
import { DEFAULT_CHAIN_PROPS } from './helper';
import { ChainContextProps } from './types';

export const ChainContext: Context<ChainContextProps> = createContext<ChainContextProps>(
  DEFAULT_CHAIN_PROPS
);
