import type { BaseProps } from '@@/types';
import { Overlay } from '@components/common';
import { NodeIcon } from '@components/common/NodeIcon';
import { CircularProgress, Typography, Box } from '@material-ui/core';
import React, { memo, ReactElement, useEffect, useMemo, useState } from 'react';
import useFetch from 'use-http';
import { ChainContext } from './context';
import { ChainContextProps, Chain as ChainProps } from './types';

interface ChainProviderProps extends BaseProps {}

function Chain({
  children,
}: ChainProviderProps): ReactElement<ChainProviderProps> | null {
  const { error, loading, data } = useFetch(
    '/chain/getChainType',
    { retries: 3 },
    []
  );

  const [chains, setChains] = useState<ChainProps[]>([]);

  useEffect(() => {
    if (data) setChains(data.data);
  }, [data]);

  const value = useMemo<ChainContextProps>(
    (): ChainContextProps => ({ chains, setChains }),
    [chains]
  );

  if (error) {
    return (
      <Overlay>
        <Box>
          <Typography
            variant="body1"
            color="error"
            className="word-break"
            align="center"
          >
            {error.message}
          </Typography>
        </Box>
      </Overlay>
    );
  } else if (loading) {
    return (
      <Overlay>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          marginTop={1}
          flexGrow={1}
        >
          <Box
            id="logo"
            className="animate__animated animate__pulse animate__infinite"
          >
            <Typography variant="h1">
              <NodeIcon name="UECC" fontSize="inherit" />
            </Typography>
          </Box>
        </Box>
      </Overlay>
    );
  } else if (!chains.length) {
    return (
      <Overlay>
        <Box>
          <Typography
            variant="body1"
            color="error"
            className="word-break"
            align="center"
          >
            暂无可用的链，请稍候重试。
          </Typography>
        </Box>
      </Overlay>
    );
  } else {
    return (
      <ChainContext.Provider value={value}>{children}</ChainContext.Provider>
    );
  }
}

export const ChainProvider = memo(Chain);
