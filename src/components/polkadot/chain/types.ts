import type { ChainProperties, ChainType } from '@polkadot/types/interfaces';

export interface ChainSystemInfo {
  // properties: ChainProperties;
  systemChain: string;
  // systemChainType: ChainType;
  systemName: string;
  systemVersion: string;
  isDevelopment: boolean;
  ss58Format: number;
  tokenDecimals: number[];
  tokenSymbol: string[];
}

export interface ChainContextProps extends ChainSystemInfo {
  genesisHash: string;
  isChainReady: boolean;
}
