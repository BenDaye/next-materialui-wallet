import { useError } from '@components/error';
import { Box } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { isHex } from '@polkadot/util';
import { BlockByHash, BlockByNumber } from '@components/explorer';
import { PageHeader } from '@components/common';

export default function Block() {
  const router = useRouter();
  const { setError } = useError();
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const [blockHash, setBlockHash] = useState<string>('');
  const { id } = router.query;

  // TODO: 判断url参数
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
      <PageHeader title="区块详情" />
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
