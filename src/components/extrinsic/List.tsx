import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
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
import { getEra } from './helper';
import { formatBalance, formatNumber } from '@polkadot/util';
import { AccountInfo } from '@components/account';

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

  const getExternalElement = (extrinsic: Extrinsic): ReactNode => {
    const mortality: string | null = useMemo((): string | null => {
      if (!extrinsic.isSigned) return null;
      const era = getEra(extrinsic, blockNumber);

      return era
        ? `存在的, 起始 #{${formatNumber(era[0])}} 直至 #{${formatNumber(
            era[1]
          )}}`
        : '持续的';
    }, [blockNumber, extrinsic]);

    const tip: string | null = useMemo((): string | null => {
      if (!extrinsic.tip) return null;

      const _tip = formatBalance(extrinsic.tip, { withSiFull: true });

      return _tip === '0' ? null : _tip;
    }, [extrinsic]);

    return (
      <>
        {mortality && (
          <ListItem disableGutters button>
            <ListItemText
              primary="生命周期"
              primaryTypographyProps={{
                color: 'secondary',
              }}
              secondary={mortality}
              secondaryTypographyProps={{
                className: 'word-break',
                variant: 'caption',
                component: 'p',
                color: 'textPrimary',
              }}
            />
          </ListItem>
        )}
        {tip && (
          <ListItem disableGutters button>
            <ListItemText
              primary="小费"
              primaryTypographyProps={{
                color: 'secondary',
              }}
              secondary={tip}
              secondaryTypographyProps={{
                className: 'word-break',
                variant: 'caption',
                component: 'p',
                color: 'textPrimary',
              }}
            />
          </ListItem>
        )}
        {extrinsic.isSigned && (
          <>
            <ListItem disableGutters>
              <ListItemText
                primary="签名人"
                primaryTypographyProps={{
                  color: 'secondary',
                }}
              />
            </ListItem>
            <AccountInfo
              value={extrinsic.signer.toString()}
              onlyItem
              disableGutters
            />
          </>
        )}
      </>
    );
  };

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
            withHash
            withSignature
          >
            {getExternalElement(extrinsic)}
          </ExtrinsicItem>
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
