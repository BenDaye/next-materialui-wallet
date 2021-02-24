import { useError } from '@components/Error';
import { useApi, useIsMountedRef } from '@components/polkadot';
import { Backdrop, CircularProgress } from '@material-ui/core';
import React, { memo, ReactElement, useEffect, useState } from 'react';
import type { Hash } from '@polkadot/types/interfaces';
import BlockByHash from './BlockByHash';

interface BlockByNumberProps {
  blockNumber: number;
}

function BlockByNumberProvider({
  blockNumber,
}: BlockByNumberProps): ReactElement<BlockByNumberProps> {
  const { api } = useApi();
  const [blockHash, setBlockHash] = useState<Hash | null>(null);
  const mountedRef = useIsMountedRef();
  const { setError } = useError();

  useEffect(() => {
    api.rpc.chain
      .getBlockHash(blockNumber)
      .then((res: Hash) => {
        mountedRef.current && setBlockHash(res);
      })
      .catch((error: Error) => {
        mountedRef.current && setError(error);
      });
  }, [api, mountedRef, blockNumber]);

  if (!blockHash) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return <BlockByHash blockHash={blockHash.toHex()} />;
}

export default memo(BlockByNumberProvider);
