import { useError } from '@@/hook';
import { Box, Container } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { isHex } from '@polkadot/util';
import { BlockByHash } from '@components/explorer/block/ByHash';
import { BlockByNumber } from '@components/explorer/block/ByNumber';
import { PageHeader } from '@components/common';

export default function BlockPage() {
  const {
    query: { id },
  } = useRouter();
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const [blockHash, setBlockHash] = useState<string>('');

  useEffect(() => {
    if (!id) return;

    if (isHex(id)) {
      setBlockHash(id);
    } else if (!Number.isNaN(Number(id))) {
      setBlockNumber(Number(id));
    }
  }, [id]);

  if (!id) return null;
  return (
    <>
      <PageHeader title="区块详情" />
      <Container>
        {blockHash ? (
          <BlockByHash value={blockHash} />
        ) : (
          <BlockByNumber value={blockNumber} />
        )}
      </Container>
    </>
  );
}
