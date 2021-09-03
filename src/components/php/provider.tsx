import { useIsMountedRef, useNotice } from '@@/hook';
import type { BaseProps } from '@@/types';
import { memo, ReactElement, useMemo } from 'react';
import { AccountProvider } from './account/provider';
import { IncomingOptions, Provider as HttpProvider } from 'use-http';

interface PhpProviderProps extends BaseProps {}

function Php({ children }: PhpProviderProps): ReactElement<PhpProviderProps> {
  const { showError, showWarning } = useNotice();
  const mountedRef = useIsMountedRef();
  const url = useMemo(
    (): string => process.env.BASE_URL || 'http://168.63.250.198:1323',
    [mountedRef]
  );

  const options: IncomingOptions = {
    interceptors: {
      request: async ({ options, url, path, route }) => {
        console.log(url, path, route);
        return options;
      },
      response: async ({ response }) => {
        return response;
      },
    },
    onError: ({ error }: any) => showError((error as Error).message),
    timeout: 5000,
    onTimeout: () => showWarning('请求超时'),
  };

  return (
    <HttpProvider url={url} options={options}>
      <AccountProvider>{children}</AccountProvider>
    </HttpProvider>
  );
}

export const PhpProvider = memo(Php);
