import { ApiPromise } from '@polkadot/api';
import type { ChainProperties, ChainType } from '@polkadot/types/interfaces';

export interface ApiState {
  isApiReady: boolean;
  isDevelopment: boolean;
}

export interface ApiProps extends ApiState {
  api: ApiPromise;
  apiError: string | null;
  isApiConnected: boolean;
  isApiInitialized: boolean;
}

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
