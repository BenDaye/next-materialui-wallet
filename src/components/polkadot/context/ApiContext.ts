import { ApiPromise } from '@polkadot/api';
import { Context, createContext } from 'react';
import type { ChainType } from '@polkadot/types/interfaces';

export interface ApiSystemInfo {
  systemChain: string;
  systemChainType: ChainType;
}
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

export const ApiContext: Context<ApiProps> = createContext(
  ({} as unknown) as ApiProps
);
