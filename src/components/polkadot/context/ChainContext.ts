import { Context, createContext } from 'react';
import type { ChainProperties, ChainType } from '@polkadot/types/interfaces';

export interface ChainState {
  systemChain: string;
  systemChainType: ChainType;
}

export interface ChainProps {
  properties: ChainProperties;
  systemName: string;
  systemVersion: string;
  ss58Format?: number;
  tokenDecimals?: any;
  tokenSymbol?: any;
  genesisHash?: string;
}

export const ChainContext: Context<ChainProps> = createContext<ChainProps>(
  ({} as unknown) as ChainProps
);
