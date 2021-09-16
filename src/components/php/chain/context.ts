import { Context, createContext } from 'react';
import { Chain, ChainContextProps } from './types';

export const ChainContext: Context<ChainContextProps> =
  createContext<ChainContextProps>({
    chains: [],
    setChains: (chains: Chain[]) => {},
  });
