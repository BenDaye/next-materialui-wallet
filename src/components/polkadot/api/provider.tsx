import { ApiPromise, WsProvider } from '@polkadot/api';
import React, { memo, ReactElement, useEffect, useMemo, useState } from 'react';
import type { ApiContextProps } from './types';
import { ApiContext } from './context';
import type { BaseProps } from '@@/types';
import { useSetting } from '@@/hook';
import { Overlay } from '@components/common';
import { SwitchNodeButton } from '@components/setting/components/SwitchNodeButton';
import { Box, CircularProgress, Typography } from '@material-ui/core';

interface ApiProviderProps extends BaseProps {}

let api: ApiPromise;

function Api({
  children,
}: ApiProviderProps): ReactElement<ApiProviderProps> | null {
  const { node } = useSetting();
  const [isApiReady, setIsApiReady] = useState<boolean>(false);
  const [isApiConnected, setIsApiConnected] = useState<boolean>(false);
  const [isApiInitialized, setIsApiInitialized] = useState<boolean>(false);
  const [apiError, setApiError] = useState<null | string>(null);

  const value = useMemo<ApiContextProps>(
    () => ({ api, apiError, isApiReady, isApiConnected, isApiInitialized }),
    [apiError, isApiConnected, isApiInitialized, isApiReady]
  );

  const handleConnected = () => setIsApiConnected(true);
  const handleDisconnected = () => setIsApiConnected(false);
  const handleConnectError = (error: any) => {
    setApiError((error as Error).message || '节点错误或无响应');
  };

  const handleConnectReady = () => setIsApiReady(true);

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
      setIsApiReady(false);
      setIsApiConnected(false);
      setApiError(null);
      if (api) {
        if (api.isConnected) {
          try {
            api.disconnect();
          } catch (error) {
            // ignore error
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
  } else if (value.apiError) {
    return (
      <Overlay>
        <Box>
          <Typography
            variant="body1"
            color="error"
            className="word-break"
            align="center"
          >
            {value.apiError}
          </Typography>
        </Box>
        <Box mt={2}>
          <SwitchNodeButton />
        </Box>
      </Overlay>
    );
  } else if (!value.isApiReady) {
    return (
      <Overlay>
        <Box>
          <CircularProgress color="secondary" />
        </Box>
        <Box mt={2}>
          <Typography variant="body1" className="word-break" align="center">
            初始化节点数据
          </Typography>
        </Box>
      </Overlay>
    );
  } else if (!value.isApiConnected) {
    return (
      <Overlay>
        <Box>
          <Typography
            variant="body1"
            color="error"
            className="word-break"
            align="center"
          >
            无法连接节点,请尝试切换节点或刷新页面。
          </Typography>
        </Box>
        <Box mt={2}>
          <SwitchNodeButton />
        </Box>
      </Overlay>
    );
  } else {
    return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
  }
}

export const ApiProvider = memo(Api);
