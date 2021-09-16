import React, { Fragment, memo, ReactElement, useCallback } from 'react';
import type { BaseProps } from '@@/types';
import styles from '@styles/AccountSelector.module.css';
import {
  Avatar,
  Box,
  CircularProgress,
  createStyles,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  makeStyles,
  Theme,
} from '@material-ui/core';
import Image from 'material-ui-image';
import { useChain } from '@components/php/chain/hook';
import { Chain } from '@components/php/chain/types';

interface ChainListProps extends BaseProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    list: {
      width: theme.spacing(8),
    },
    icon: {
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
  })
);

function ChainListBase({
  children,
}: ChainListProps): ReactElement<ChainListProps> {
  const classes = useStyles();
  const { chains, setChains } = useChain();

  const onSelect = useCallback(
    (c: Chain) => {
      const _chains = chains.map((chain) => {
        if (chain.name === c.name) return { ...chain, activated: true };
        return { ...chain, activated: false };
      });
      setChains(_chains);
    },
    [chains]
  );

  return (
    <>
      <Box
        flexShrink={0}
        bgcolor="background.paper"
        className={styles.content}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box className={classes.list} overflow="hidden">
          <List dense disablePadding>
            {chains.map((chain, index, array) => (
              <Fragment key={`chain: ${chain.name}`}>
                <ListItem
                  button
                  selected={chain.activated}
                  onClick={() => onSelect(chain)}
                  disableGutters
                >
                  <ListItemAvatar>
                    <Box p={2}>
                      <Avatar
                        src={`/img/${chain.name}@2x.png`}
                        variant="circular"
                        className={classes.icon}
                      />
                    </Box>
                  </ListItemAvatar>
                </ListItem>
              </Fragment>
            ))}
          </List>
        </Box>
      </Box>
      {children}
    </>
  );
}

export const ChainList = memo(ChainListBase);
