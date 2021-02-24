import { useError } from '@components';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useRouter } from 'next/router';
import React, { memo, useEffect, useState } from 'react';
import { isHex } from '@polkadot/util';
import { BlockByHash, BlockByNumber } from '@components/explorer';

function Block() {
  const router = useRouter();
  const { setError } = useError();
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const [blockHash, setBlockHash] = useState<string>('');
  const { id } = router.query;

  useEffect(() => {
    if (isHex(id)) {
      setBlockHash(id);
    } else if (!Number.isNaN(Number(id))) {
      setBlockNumber(Number(id));
    } else {
      setError(new TypeError('id is required'));
      router.back();
    }
  }, [id]);

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" onClick={() => router.back()}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography>区块详情</Typography>
        </Toolbar>
      </AppBar>
      <Box flexGrow={1}>
        {blockHash ? (
          <BlockByHash blockHash={blockHash} />
        ) : (
          <BlockByNumber blockNumber={blockNumber} />
        )}
      </Box>
    </>
  );
}

export default memo(Block);
