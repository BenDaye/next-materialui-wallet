import type { ChainProperties, ChainType } from '@polkadot/types/interfaces';

export interface ChainSystemInfo {
  properties: ChainProperties;
  systemChain: string;
  systemChainType: ChainType;
  systemName: string;
  systemVersion: string;
}

export interface ChainContextProps extends ChainSystemInfo {
  ss58Format: number;
  tokenDecimals: number[];
  tokenSymbol: string[];
  genesisHash: string;
  isChainReady: boolean;
  isDevelopment: boolean;
}
