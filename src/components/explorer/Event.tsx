import React, { memo, ReactElement, ReactNode } from 'react';
import MenuDownIcon from 'mdi-material-ui/MenuDown';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@material-ui/core';
import type { KeyedEvent } from '@components/polkadot/event/types';
import type { BaseProps } from '@@/types';
import { formatMeta } from '@utils/formatMeta';

interface EventProps extends BaseProps {
  event: KeyedEvent;
}

function Event({
  children,
  event: { record, indexes, blockNumber },
}: EventProps): ReactElement<EventProps> {
  const {
    event: { section, method, meta },
  } = record;
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<MenuDownIcon />}
        aria-controls="event-content"
      >
        <Box>
          <Typography variant="subtitle2">
            {section}.{method}
          </Typography>
          <Typography variant="caption" color="textSecondary" component="p">
            {formatMeta(meta)}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography className="word-break">
          {record.event.toString()}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

export default Event;
