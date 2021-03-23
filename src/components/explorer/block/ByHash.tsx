import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type { BaseProps } from '@@/types';
import { useChain, useNotice, useApi } from '@@/hook';
import { Box } from '@material-ui/core';
import { KeyedEvent } from '@components/polkadot/event/types';
import type { EventRecord, SignedBlock } from '@polkadot/types/interfaces';
import { HeaderExtended } from '@polkadot/api-derive';
import { transformResult } from './helper';
import { EventListItem } from '../event/ListItem';
import { ExtrinsicItem } from './Extrinsic';

interface BlockByHashProps extends BaseProps {
  value: string;
}

function ByHash({
  children,
  value,
}: BlockByHashProps): ReactElement<BlockByHashProps> | null {
  const { isChainReady } = useChain();
  const { api } = useApi();
  const { showError } = useNotice();
  const [events, setEvents] = useState<KeyedEvent[]>([]);
  const [block, setBlock] = useState<SignedBlock | null>(null);
  const [header, setHeader] = useState<HeaderExtended | null>(null);

  useEffect(() => {
    if (!value) return;

    Promise.all([
      api.query.system.events.at(value),
      api.rpc.chain.getBlock(value),
      api.derive.chain.getHeader(value),
    ]).then((res) => {
      const [_events, _block, _header] = transformResult(res);
      setEvents(_events);
      setBlock(_block);
      _header && setHeader(_header);
    });
  }, [api, isChainReady, value]);

  if (!isChainReady) return null;
  return (
    <Box display="flex" flexDirection="column" className="word-break">
      <Box mt={2}>
        {block?.block.extrinsics.map((extrinsic, index) => (
          <ExtrinsicItem
            key={`extrinsic-${index}`}
            index={index}
            events={events}
            blockNumber={header?.number.unwrap()}
            extrinsic={extrinsic}
          />
        ))}
      </Box>
    </Box>
  );
}

export const BlockByHash = memo(ByHash);
