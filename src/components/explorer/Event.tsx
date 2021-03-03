import React, { memo, ReactElement, ReactNode } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';
import { KeyedEvent } from '@components/polkadot/context';
import { Children } from '@components/types';

interface EventProps extends Children {
  event: KeyedEvent;
}

function Event({ children, event }: EventProps): ReactElement<EventProps> {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="event-content"
      >
        <Typography>{event.record.event.method}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

export default Event;
