import { ChainContext, ChainProps } from '@components/polkadot/context';
import { useContext } from 'react';

export const useChain = (): ChainProps => useContext(ChainContext);
