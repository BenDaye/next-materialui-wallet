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
  Accordion,
  AccordionSummary as MuiAccordionSummary,
  withStyles,
  Box,
  List,
  ListItem,
  ListItemText,
  AccordionDetails,
} from '@material-ui/core';
import MenuDownIcon from 'mdi-material-ui/MenuDown';
import type { KeyedEvent } from '@components/polkadot/event/types';
import { EventParam, EventListItem } from '@components/event';
import type { BlockNumber, Extrinsic } from '@polkadot/types/interfaces';
import { formatMeta } from '@utils/formatMeta';
import type { Extracted, ParamDef } from './types';
import { extractState, getEra } from './helper';
import { formatBalance, formatNumber } from '@polkadot/util';
import { AccountInfo } from '@components/account';

interface ExtrinsicItemProps extends BaseProps {
  index: number;
  blockNumber?: BlockNumber;
  events?: KeyedEvent[];
  extrinsic: Extrinsic;
}

const AccordionSummary = withStyles({
  content: {
    margin: 0,
    '&$expanded': {
      margin: 0,
    },
  },
  expanded: {},
})(MuiAccordionSummary);

function Item({
  children,
  index,
  blockNumber,
  events = [],
  extrinsic,
}: ExtrinsicItemProps): ReactElement<ExtrinsicItemProps> {
  const { isChainReady } = useChain();
  const { showError } = useNotice();

  const { meta, method, section } = useMemo(
    () => extrinsic.registry.findMetaCall(extrinsic.callIndex),
    [extrinsic]
  );

  const [
    { hash, params, signature, signatureType, values },
    setExtracted,
  ] = useState<Extracted>({
    hash: null,
    params: [],
    signature: null,
    signatureType: null,
    values: [],
  });

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

  useEffect(() => {
    setExtracted(extractState(extrinsic, true, true));
  }, [extrinsic]);

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<MenuDownIcon />}>
        <List disablePadding>
          <ListItem disableGutters>
            <ListItemText
              primary={`${section}.${method}`}
              primaryTypographyProps={{
                color: 'secondary',
              }}
              secondary={formatMeta(meta)}
              secondaryTypographyProps={{
                className: 'word-break',
                variant: 'caption',
                component: 'p',
              }}
            />
          </ListItem>
        </List>
      </AccordionSummary>
      <AccordionDetails>
        <Box flexGrow={1}>
          {params.map(({ name, type }: ParamDef, i, array) => (
            <EventParam
              key={`param: ${i}`}
              name={name}
              type={type}
              value={values[i]}
            />
          ))}
          {events
            .filter(
              ({ record: { phase } }) =>
                phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index)
            )
            .map((e, i) => (
              <EventListItem key={`event-${i}`} value={e} elevation={2} />
            ))}
          <List dense>
            {signature && (
              <ListItem disableGutters button>
                <ListItemText
                  primary={`signature ${signatureType || ''}`}
                  primaryTypographyProps={{
                    color: 'secondary',
                  }}
                  secondary={signature}
                  secondaryTypographyProps={{
                    className: 'word-break',
                    variant: 'caption',
                    component: 'p',
                    color: 'textPrimary',
                  }}
                />
              </ListItem>
            )}
            {hash && (
              <ListItem disableGutters button>
                <ListItemText
                  primary="哈希"
                  primaryTypographyProps={{
                    color: 'secondary',
                  }}
                  secondary={hash}
                  secondaryTypographyProps={{
                    className: 'word-break',
                    variant: 'caption',
                    component: 'p',
                    color: 'textPrimary',
                  }}
                />
              </ListItem>
            )}
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
          </List>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export const ExtrinsicItem = memo(Item);
