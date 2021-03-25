import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type { BaseProps } from '@@/types';
import { useChain, useNotice } from '@@/hook';
import {
  Box,
  List as MuiList,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import type { BlockNumber, Extrinsic } from '@polkadot/types/interfaces';
import type { KeyedEvent } from '@components/polkadot/event/types';
import { ExtrinsicItem } from './Item';

interface ExtrinsicListProps extends BaseProps {
  blockNumber?: BlockNumber;
  events?: KeyedEvent[];
  value: Extrinsic[];
}

function List({
  children,
  blockNumber,
  events = [],
  value = [],
}: ExtrinsicListProps): ReactElement<ExtrinsicListProps> | null {
  const { isChainReady } = useChain();
  const { showError } = useNotice();

  if (!isChainReady) return null;
  return (
    <>
      {value.length ? (
        value.map((extrinsic, index) => (
          <ExtrinsicItem
            key={`extrinsic-${index}`}
            index={index}
            events={events}
            blockNumber={blockNumber}
            extrinsic={extrinsic}
          />
        ))
      ) : (
        <MuiList disablePadding>
          <ListItem dense>
            <ListItemText primary="暂无事件" />
          </ListItem>
        </MuiList>
      )}
    </>
  );
}

export const ExtrinsicList = memo(List);
