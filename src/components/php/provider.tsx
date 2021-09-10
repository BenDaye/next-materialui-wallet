import { useDebug, useIsMountedRef, useNotice } from '@@/hook';
import type { BaseProps } from '@@/types';
import { memo, ReactElement, useCallback, useMemo } from 'react';
import { AccountProvider } from './account/provider';
import { IncomingOptions, Provider as HttpProvider } from 'use-http';
import { ChainProvider } from './chain/provider';

interface PhpProviderProps extends BaseProps {}

function Php({ children }: PhpProviderProps): ReactElement<PhpProviderProps> {
  const { showError, showWarning } = useNotice();
  const mountedRef = useIsMountedRef();
  const url = useMemo(
    (): string => process.env.BASE_URL || 'http://168.63.250.198:1323',
    [mountedRef]
  );

  const debug = useDebug();

  const handleRequest = useCallback(
    async ({ options, url, path, route }) => {
      debug && console.log('DEBUG', url, route, path);
      return options;
    },
    [debug]
  );

  const handleResponse = useCallback(
    async ({ response }) => {
      debug && console.log('DEBUG', response.data);
      if (response.ok) {
        const { status, message } = response.data;
        if (status !== 1) showError(message);
      }
      return response;
    },
    [debug]
  );

  const options: IncomingOptions = {
    interceptors: {
      request: handleRequest,
      response: handleResponse,
    },
    onError: ({ error }: any) => showError((error as Error).message),
    timeout: 30000,
    onTimeout: () => showWarning('请求超时'),
  };

  return (
    <HttpProvider url={url} options={options}>
      <ChainProvider>
        <AccountProvider>{children}</AccountProvider>
      </ChainProvider>
    </HttpProvider>
  );
}

export const PhpProvider = memo(Php);
