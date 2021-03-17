import { ApiPromise, WsProvider } from '@polkadot/api';
import React, { memo, ReactElement, useEffect, useMemo, useState } from 'react';
import type { ApiState, ApiProps } from '@components/polkadot/context';
import { ApiContext } from '../context';
import { getApiState } from '@components/polkadot/utils';
import { Children } from '@components/types';
import { useSetting } from '@components/common/Setting';

interface ApiProviderProps extends Children {}

let api: ApiPromise;

function ApiProvider({
  children,
}: ApiProviderProps): ReactElement<ApiProviderProps> | null {
  const { node } = useSetting();
  const [state, setState] = useState<ApiState>({
    isApiReady: false,
    isDevelopment: true,
  });
  const [isApiConnected, setIsApiConnected] = useState<boolean>(false);
  const [isApiInitialized, setIsApiInitialized] = useState<boolean>(false);
  const [apiError, setApiError] = useState<null | string>(null);

  const value = useMemo<ApiProps>(
    () => ({ ...state, api, apiError, isApiConnected, isApiInitialized }),
    [apiError, isApiConnected, isApiInitialized, state]
  );

  const handleConnected = () => setIsApiConnected(true);
  const handleDisconnected = () => setIsApiConnected(false);
  const handleConnectError = (error: Error) => {
    setApiError(error.message || '节点错误或无响应');
  };

  const handleConnectReady = () => {
    getApiState(api)
      .then(setState)
      .catch((err: Error) => {
        setApiError(err.message);
      });
  };

  useEffect(() => {
    if (!node) return;
    const { url, options } = node;
    const provider = new WsProvider(url);

    api = new ApiPromise({ provider, ...options });

    api.on('connected', handleConnected);
    api.on('disconnected', handleDisconnected);
    api.on('error', handleConnectError);
    api.on('ready', handleConnectReady);

    setIsApiInitialized(true);

    return () => {
      setIsApiInitialized(false);
      setState({ isApiReady: false, isDevelopment: true });
      setIsApiConnected(false);
      setApiError(null);
      if (api) {
        if (api.isConnected) {
          try {
            api.disconnect();
          } catch (error) {
            console.log(error);
          }
        }
        api.off('connected', handleConnected);
        api.off('disconnected', handleDisconnected);
        api.off('error', handleConnectError);
        api.off('ready', handleConnectReady);
      }
    };
  }, []);

  if (!value.isApiInitialized) {
    return null;
  }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export default memo(ApiProvider);
