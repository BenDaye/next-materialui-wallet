import { HeaderExtended } from '@polkadot/api-derive';
import { useBlockAuthors } from '@components/polkadot/hook';
import {
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@material-ui/core';
import React, { memo, ReactElement } from 'react';
import { Block } from '.';
import { Children } from '@components/types';
import { formatNumber } from '@polkadot/util';
import { useRouter } from 'next/router';

function BlockExplorerProvider({ children }: Children): ReactElement<Children> {
  const { lastHeaders } = useBlockAuthors();
  const router = useRouter();
  return (
    <>
      <Container>
        {/* {lastHeaders.map((header: HeaderExtended) => (
          <Box marginY={1} key={header.number.toNumber()}>
            <Block header={header} showMoreIcon isLink />
          </Box>
        ))} */}
        <Paper>
          <List disablePadding>
            {lastHeaders.map((header: HeaderExtended, index, array) => (
              <ListItem
                button
                key={header.number.toNumber()}
                divider={index < array.length - 1}
                dense
                onClick={() => router.push(`/block/${header.hash.toHex()}`)}
              >
                <ListItemText
                  primary={formatNumber(header.number.toNumber())}
                  primaryTypographyProps={{
                    color: 'secondary',
                  }}
                  secondary={header.hash.toHex()}
                  secondaryTypographyProps={{
                    className: 'text-overflow-ellipsis_one_line',
                    variant: 'caption',
                    component: 'p',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
      {children}
    </>
  );
}

export default memo(BlockExplorerProvider);
