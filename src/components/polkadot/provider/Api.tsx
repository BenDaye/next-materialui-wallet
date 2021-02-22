import { ApiPromise, WsProvider } from '@polkadot/api';
import { isTestChain } from '@polkadot/util';
import React, {
  Context,
  createContext,
  memo,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import registry from '@utils/type-registry';
import { ApiState, ApiProps, ChainState } from './types';
import { useError } from '@components/Error';

interface Props {
  children: ReactNode;
  url?: string;
}

let api: ApiPromise;

async function getChainState(api: ApiPromise): Promise<ChainState> {
  const [systemChain, systemChainType] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.chainType
      ? api.rpc.system.chainType()
      : Promise.resolve(registry.createType('ChainType', 'Live')),
  ]);

  return {
    systemChain: (systemChain || '<unknown>').toString(),
    systemChainType,
  };
}

async function init(api: ApiPromise): Promise<ApiState> {
  const { systemChain, systemChainType } = await getChainState(api);

  const isDevelopment =
    systemChainType.isDevelopment ||
    systemChainType.isLocal ||
    isTestChain(systemChain);

  return {
    isApiReady: true,
    isDevelopment,
  };
}

export const ApiContext: Context<ApiProps> = createContext(
  ({} as unknown) as ApiProps
);

function ApiProvider({
  children,
  url = 'ws://221.122.102.163:9944',
}: Props): ReactElement<Props> | null {
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

  useEffect((): void => {
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

    api.on('connected', () => setIsApiConnected(true));
    api.on('disconnected', () => setIsApiConnected(false));
    api.on('error', (err: Error) => {
      setError(err);
      setApiError(err.message);
    });
    api.on('ready', () => {
      init(api)
        .then(setState)
        .catch((err: Error) => {
          setError(err);
          setApiError(err.message);
        });
    });

    setIsApiInitialized(true);
  }, []);

  if (!value.isApiInitialized) {
    return null;
  }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export default memo(ApiProvider);

export const useApi = (): ApiProps => useContext(ApiContext);
