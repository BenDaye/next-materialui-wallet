import { Dispatch, SetStateAction } from 'react';

export interface Chain {
  name: string;
  full_name: string;
  decimals: string;
  image: string;
}

export interface ChainContextProps {
  chains: Chain[];
  currentChain: Chain | null;
  setCurrentChain: Dispatch<SetStateAction<Chain | null>>;
}
