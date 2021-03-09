import { Context, createContext } from 'react';
import { DEFAULT_CHAIN_PROPS } from '../utils';
import { ChainProps } from './types';

export const ChainContext: Context<ChainProps> = createContext<ChainProps>(
  DEFAULT_CHAIN_PROPS
);
