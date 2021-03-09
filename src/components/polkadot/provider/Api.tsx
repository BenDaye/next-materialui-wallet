import { ApiPromise, WsProvider } from '@polkadot/api';
import React, {
  memo,
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ApiState, ApiProps } from '@components/polkadot/context';
import { Backdrop, Box, CircularProgress, Typography } from '@material-ui/core';
import { ApiContext } from '../context';
import { useError } from '@components/error';
import { getApiState } from '@components/polkadot/utils';

interface ApiProviderProps {
  children: ReactNode;
  url?: string;
}

let api: ApiPromise;

function ApiProvider({
  children,
  url = 'ws://221.122.102.163:9944',
}: ApiProviderProps): ReactElement<ApiProviderProps> | null {
  const [state, setState] = useState<ApiState>({
    isApiReady: false,
    isDevelopment: true,
  });
  const [isApiConnected, setIsApiConnected] = useState<boolean>(false);
  const [isApiInitialized, setIsApiInitialized] = useState<boolean>(false);
  const [apiError, setApiError] = useState<null | string>(null);
  const { setError } = useError();

  const value = useMemo<ApiProps>(
    () => ({ ...state, api, apiError, isApiConnected, isApiInitialized }),
    [apiError, isApiConnected, isApiInitialized, state]
  );

  const handleConnected = () => setIsApiConnected(true);
  const handleDisconnected = () => setIsApiConnected(false);
  const handleConnectError = (error: Error) => {
    setError(error);
    setApiError(error.message);
  };

  const handleConnectReady = () => {
    getApiState(api)
      .then(setState)
      .catch((err: Error) => {
        setError(err);
        setApiError(err.message);
      });
  };

  useEffect(() => {
    const provider = new WsProvider(url);
    const types = {
      Address: 'AccountId',
      LookupSource: 'AccountId',
      URC10: {
        symbol: 'Vec<u8>',
        name: 'Vec<u8>',
        decimals: 'u8',
        max_supply: 'u64',
      },
    };

    api = new ApiPromise({ provider, types });

    api.on('connected', handleConnected);
    api.on('disconnected', handleDisconnected);
    api.on('error', handleConnectError);
    api.on('ready', handleConnectReady);

    setIsApiInitialized(true);
    return () => {
      if (api) {
        api.off('connected', handleConnected);
        api.off('disconnected', handleDisconnected);
        api.off('error', handleConnectError);
        api.off('ready', handleConnectReady);
      }
    };
  }, []);

  // TODO: 弹出一个对话框或者跳转页面,查看节点连接状态,或切换节点
  // if (!value.isApiReady) {
  //   return (
  //     <Backdrop open={true}>
  //       <CircularProgress color="secondary" />
  //     </Backdrop>
  //   );
  // }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export default memo(ApiProvider);
