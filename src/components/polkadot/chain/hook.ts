import { ChainContext } from './context';
import type { ChainContextProps } from './types';
import { useContext } from 'react';

export const useChain = (): ChainContextProps =>
  useContext<ChainContextProps>(ChainContext);
