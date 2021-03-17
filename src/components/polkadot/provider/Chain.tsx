import React, { memo, ReactElement, useEffect, useState } from 'react';
import { KeyringStore } from '@polkadot/ui-keyring/types';
import { Children } from '@components/types';
import { ChainContext, ChainProps } from '@components/polkadot/context';
import { useApi } from '@components/polkadot/hook';
import { DEFAULT_CHAIN_PROPS, getChainState } from '@components/polkadot/utils';
import { useError } from '@components/error';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import { useSetting } from '@components/common/Setting';

interface ChainProviderProps extends Children {
  store?: KeyringStore;
}

function ChainProvider({
  children,
  store,
}: ChainProviderProps): ReactElement<ChainProviderProps> {
  const {
    api,
    isDevelopment,
    isApiReady,
    isApiConnected,
    isApiInitialized,
    apiError,
  } = useApi();
  const { setError } = useError();
  const [state, setState] = useState<ChainProps>(DEFAULT_CHAIN_PROPS);
  const { showNodeDialogAction } = useSetting();

  useEffect(() => {
    getChainState(api, isDevelopment, store).then(setState).catch(setError);
  }, [api, isDevelopment, isApiReady]);

  if (!isApiInitialized) {
    return (
      <Backdrop open={true}>
        <Box
          width="70%"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Box mb={2}>
            <CircularProgress color="secondary" />
          </Box>
          <Typography variant="body1" className="word-break" align="center">
            初始化...
          </Typography>
        </Box>
      </Backdrop>
    );
  } else if (apiError) {
    return (
      <Backdrop open={true}>
        <Box
          width="70%"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography
            variant="body1"
            color="error"
            className="word-break"
            align="center"
          >
            {apiError}
          </Typography>
          <Box mt={2}>
            <Button variant="contained" onClick={showNodeDialogAction}>
              切换节点
            </Button>
          </Box>
        </Box>
      </Backdrop>
    );
  } else if (!isApiReady) {
    return (
      <Backdrop open={true}>
        <Box
          width="70%"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Box mb={2}>
            <CircularProgress color="secondary" />
          </Box>
          <Typography variant="body1" className="word-break" align="center">
            连接中...
          </Typography>
        </Box>
      </Backdrop>
    );
  } else if (!isApiConnected) {
    return (
      <Backdrop open={true}>
        <Box
          width="70%"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography
            variant="body1"
            color="error"
            className="word-break"
            align="center"
          >
            未知原因导致无法连接,请稍候尝试刷新页面。
          </Typography>
          <Box mt={2}>
            <Button variant="contained" onClick={showNodeDialogAction}>
              切换节点
            </Button>
          </Box>
        </Box>
      </Backdrop>
    );
  } else {
    return (
      <ChainContext.Provider value={state}>{children}</ChainContext.Provider>
    );
  }
}

export default memo(ChainProvider);
