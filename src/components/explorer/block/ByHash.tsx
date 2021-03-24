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
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { KeyedEvent } from '@components/polkadot/event/types';
import type { EventRecord, SignedBlock } from '@polkadot/types/interfaces';
import { HeaderExtended } from '@polkadot/api-derive';
import { transformResult } from './helper';
import { EventListItem } from '../event/ListItem';
import { ExtrinsicItem } from './Extrinsic';
import { Skeleton } from '@material-ui/lab';
import { BlockItem } from './Item';
import { BlockLog } from './Log';

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

  const systemEvents: KeyedEvent[] = useMemo(
    () => events.filter(({ record: { phase } }) => !phase.isApplyExtrinsic),
    [events]
  );

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
      <Box pt={2}>
        <Box mb={2}>
          <Typography variant="subtitle1" gutterBottom>
            信息
          </Typography>
          {header && <BlockItem value={header} />}
        </Box>
        <Box mb={2}>
          <Typography variant="subtitle1" gutterBottom>
            事件
          </Typography>
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
        <Box mb={2}>
          <Typography variant="subtitle1" gutterBottom>
            系统事件
          </Typography>
          {systemEvents?.length ? (
            systemEvents.map((e, i) => (
              <EventListItem key={`system_event-${i}`} value={e} />
            ))
          ) : (
            <List disablePadding>
              <ListItem dense>
                <ListItemText primary="暂无系统事件" />
              </ListItem>
            </List>
          )}
        </Box>
        <Box mb={2}>
          <Typography variant="subtitle1" gutterBottom>
            日志
          </Typography>
          {header?.digest.logs.isEmpty ? (
            <List disablePadding>
              <ListItem dense>
                <ListItemText primary="暂无日志" />
              </ListItem>
            </List>
          ) : (
            <BlockLog value={header?.digest.logs || []} />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export const BlockByHash = memo(ByHash);
