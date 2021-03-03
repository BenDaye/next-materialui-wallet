import type { EventRecord, SignedBlock } from '@polkadot/types/interfaces';

import { Box, Container, Typography } from '@material-ui/core';
import { HeaderExtended } from '@polkadot/api-derive';
import React, { memo, ReactElement, useEffect, useState } from 'react';
import { useApi, useIsMountedRef } from '@components/polkadot/hook';
import Block from './Block';
import CardContentItemValue from './CardContentItemValue';
import Events from './Events';
import Extrinsics from './Extrinsics';
import { useError } from '@components/error';
import { KeyedEvent } from '@components/polkadot/context';

interface BlockByHashProps {
  blockHash: string;
}

function transformResult([events, block, header]: [
  EventRecord[],
  SignedBlock,
  HeaderExtended?
]): [KeyedEvent[], SignedBlock, HeaderExtended?] {
  return [
    events.map((record, index) => ({
      indexes: [index],
      key: `${Date.now()}-${index}-${record.hash.toHex()}`,
      record,
    })),
    block,
    header,
  ];
}

function BlockByHashProvider({
  blockHash,
}: BlockByHashProps): ReactElement<BlockByHashProps> {
  const { setError } = useError();
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [[events, block, header], setState] = useState<
    [KeyedEvent[]?, SignedBlock?, HeaderExtended?]
  >([]);

  useEffect(() => {
    if (blockHash) {
      Promise.all([
        api.query.system.events.at(blockHash),
        api.rpc.chain.getBlock(blockHash),
        api.derive.chain.getHeader(blockHash),
      ])
        .then((res) => {
          mountedRef.current && setState(transformResult(res));
        })
        .catch((error: Error) => {
          mountedRef.current && setError(error);
        });
    }
  }, [api, mountedRef, blockHash]);

  return (
    <Container>
      <Box mt={2}>
        <Typography variant="subtitle2" gutterBottom>
          区块
        </Typography>
        {header && (
          <Block
            header={header}
            contentExtended={
              <>
                <Typography variant="subtitle2">作者</Typography>
                <CardContentItemValue
                  value={header?.author?.toString() || '<unknown>'}
                />
              </>
            }
          />
        )}
      </Box>
      <Box mt={2}>
        <Typography variant="subtitle2" gutterBottom>
          事件
        </Typography>
        {block && header && (
          <Extrinsics
            blockNumber={header.number.unwrap()}
            events={events}
            extrinsics={block.block.extrinsics}
          />
        )}
      </Box>
      <Box mt={2}>
        <Typography variant="subtitle2" gutterBottom>
          系统事件
        </Typography>
        <Events
          events={events?.filter(
            ({ record: { phase } }) => !phase.isApplyExtrinsic
          )}
        />
      </Box>
      <Box mt={2}>
        <Typography variant="subtitle2" gutterBottom>
          日志
        </Typography>
        <Box width={1} overflow="hidden">
          <Typography variant="body2">
            {header?.digest.logs.toString()}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default memo(BlockByHashProvider);
