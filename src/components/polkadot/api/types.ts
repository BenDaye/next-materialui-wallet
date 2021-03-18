import { ApiPromise } from '@polkadot/api';
// import type { ChainType } from '@polkadot/types/interfaces';

// export interface ApiSystemInfo {
//   systemChain: string;
//   systemChainType: ChainType;
// }
// export interface ApiState {
//   isApiReady: boolean;
//   isDevelopment: boolean;
// }

export interface ApiContextProps {
  api: ApiPromise;
  apiError: string | null;
  isApiReady: boolean;
  isApiConnected: boolean;
  isApiInitialized: boolean;
}
