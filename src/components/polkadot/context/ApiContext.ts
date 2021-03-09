import { Context, createContext } from 'react';
import { ApiProps } from './types';

export const ApiContext: Context<ApiProps> = createContext<ApiProps>(
  ({} as unknown) as ApiProps
  // {
  //   api: new ApiPromise(),
  //   apiError: null,
  //   isApiReady: false,
  //   isDevelopment: true,
  //   isApiConnected: false,
  //   isApiInitialized: false,
  // }
);
