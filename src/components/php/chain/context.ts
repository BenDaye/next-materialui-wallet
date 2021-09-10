import { Context, createContext } from 'react';
import { Chain, ChainContextProps } from './types';

export const ChainContext: Context<ChainContextProps> =
  createContext<ChainContextProps>({
    chains: [],
    currentChain: null,
    setCurrentChain: (value: Chain | null) => {},
  });
