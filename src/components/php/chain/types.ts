import { Dispatch, SetStateAction } from 'react';

export interface Chain {
  name: string;
  full_name: string;
  decimals: string;
  image: string;
  activated?: boolean;
}

export interface ChainContextProps {
  chains: Chain[];
  setChains: Dispatch<SetStateAction<Chain[]>>;
}
