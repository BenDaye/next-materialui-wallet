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
  AccordionDetails,
  Box,
  Typography,
  List,
  ListItem as MuiListItem,
  ListItemText,
  withStyles,
  AccordionActions,
  Button,
  Divider,
} from '@material-ui/core';
import type { KeyedEvent } from '@components/polkadot/event/types';
import MenuDownIcon from 'mdi-material-ui/MenuDown';
import { formatMeta } from '@utils/formatMeta';
import { formatNumber } from '@polkadot/util';
import { EventListItemParams } from './Params';
import { useRouter } from 'next/router';

interface EventListItemProps extends BaseProps {
  value: KeyedEvent;
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

function ListItem({
  children,
  value,
}: EventListItemProps): ReactElement<EventListItemProps> {
  const { isChainReady } = useChain();
  const { showError } = useNotice();
  const router = useRouter();
  const { record, indexes, blockNumber, blockHash } = value;
  const {
    event: { section, method, meta },
  } = record;

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<MenuDownIcon />}>
        <List disablePadding>
          <MuiListItem disableGutters>
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
          </MuiListItem>
        </List>
      </AccordionSummary>
      <AccordionDetails>
        <Box flexGrow={1}>
          <EventListItemParams value={record.event} />
        </Box>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button
          color="secondary"
          onClick={() => router.push(`/block/${blockHash}`)}
        >
          {`${formatNumber(blockNumber)}-${indexes[0]}`}
        </Button>
      </AccordionActions>
    </Accordion>
  );
}

export const EventListItem = memo(ListItem);
