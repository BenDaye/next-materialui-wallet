import { Context, createContext } from 'react';
import type { ChainProperties } from '@polkadot/types/interfaces';

export interface ChainSystemInfo {
  properties: ChainProperties;
  systemName: string;
  systemVersion: string;
}

export interface ChainProps extends ChainSystemInfo {
  ss58Format: number;
  tokenDecimals: number[];
  tokenSymbol: string[];
  genesisHash: string;
  isChainReady: boolean;
}

export const ChainContext: Context<ChainProps> = createContext<ChainProps>(
  ({} as unknown) as ChainProps
);
