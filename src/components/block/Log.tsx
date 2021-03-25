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
  AccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  withStyles,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { DigestItem } from '@polkadot/types/interfaces/runtime/types';
import MenuDownIcon from 'mdi-material-ui/MenuDown';
import { formatLog } from './helper';

interface BlockLogProps extends BaseProps {
  value: DigestItem[];
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

function Log({
  children,
  value,
}: BlockLogProps): ReactElement<BlockLogProps> | null {
  const { isChainReady } = useChain();
  const { showError } = useNotice();

  if (!isChainReady) return null;
  return (
    <>
      {value.map((log, index) => (
        <Accordion key={`log-${index}`}>
          <AccordionSummary expandIcon={<MenuDownIcon />}>
            <List disablePadding>
              <ListItem dense disableGutters>
                <ListItemText primary={log.type.toString()} />
              </ListItem>
            </List>
          </AccordionSummary>
          <AccordionDetails>
            <Box flexGrow={1}>{formatLog(log)}</Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}

export const BlockLog = memo(Log);
