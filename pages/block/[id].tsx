import { useError } from '@@/hook';
import { Box, Container } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { isHex } from '@polkadot/util';
import { BlockByHash, BlockByNumber } from '@components/block';
import { PageHeader } from '@components/common';

export default function BlockPage() {
  const {
    query: { id },
  } = useRouter();
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [blockHash, setBlockHash] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    if (isHex(id)) {
      setBlockHash(id);
    } else if (!Number.isNaN(Number(id))) {
      setBlockNumber(Number(id));
    }
  }, [id]);

  if (!id || (blockNumber === null && !blockHash)) return null;

  if (blockHash) {
    return (
      <>
        <PageHeader title="区块详情" />
        <Container>
          <BlockByHash value={blockHash} />
        </Container>
      </>
    );
  }

  if (blockNumber !== null && blockNumber > -1) {
    return (
      <>
        <PageHeader title="区块详情" />
        <Container>
          <BlockByNumber value={blockNumber} />
        </Container>
      </>
    );
  }
}
