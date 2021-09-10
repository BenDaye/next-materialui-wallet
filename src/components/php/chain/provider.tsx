import type { BaseProps } from '@@/types';
import { Overlay } from '@components/common';
import { CircularProgress, Typography, Box } from '@material-ui/core';
import React, { memo, ReactElement, useMemo, useState } from 'react';
import useFetch from 'use-http';
import { ChainContext } from './context';
import { ChainContextProps, Chain as ChainProps } from './types';

interface ChainProviderProps extends BaseProps {}

function Chain({
  children,
}: ChainProviderProps): ReactElement<ChainProviderProps> | null {
  const [currentChain, setCurrentChain] = useState<ChainProps | null>(null);
  const { error, loading, data } = useFetch(
    '/chain/getChainType',
    undefined,
    []
  );

  const chains = useMemo<ChainProps[]>((): ChainProps[] => {
    return data ? data.data : [];
  }, [data]);

  const value = useMemo<ChainContextProps>(
    (): ChainContextProps => ({ chains, currentChain, setCurrentChain }),
    [chains, currentChain]
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
        <Box>
          <CircularProgress color="secondary" />
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
            暂无可用的链,请稍候重试
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
