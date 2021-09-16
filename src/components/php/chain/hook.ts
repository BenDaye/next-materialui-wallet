import { useContext, useMemo } from 'react';
import { ChainContext } from './context';
import { Chain, ChainContextProps } from './types';

export const useChain = (): ChainContextProps =>
  useContext<ChainContextProps>(ChainContext);

export const useCurrentChain = (): Chain | undefined => {
  const { chains } = useChain();
  return useMemo(() => chains?.find((c) => c.activated), [chains]);
};
