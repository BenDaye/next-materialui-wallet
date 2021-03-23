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
import type { BlockNumber, Extrinsic } from '@polkadot/types/interfaces';
import { formatMeta } from '@utils/formatMeta';
import { EventListItem } from '../event/ListItem';
import { Extracted } from '@components/transaction/types';
import { extractState } from '@components/transaction/helper';
import { EventParam } from '../event/param';
import type { ParamDef } from '../event/types';

interface ExtrinsicItemProps extends BaseProps {
  index: number;
  blockNumber?: BlockNumber;
  events: KeyedEvent[];
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

function ExtrinsicBase({
  children,
  index,
  blockNumber,
  events,
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

  useEffect(() => {
    setExtracted(extractState(extrinsic));
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
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export const ExtrinsicItem = memo(ExtrinsicBase);
