import { ApiPromise } from '@polkadot/api';
import { Context, createContext } from 'react';

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
