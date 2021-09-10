import { useContext } from 'react';
import { ChainContext } from './context';
import { ChainContextProps } from './types';

export const useChain = (): ChainContextProps =>
  useContext<ChainContextProps>(ChainContext);
