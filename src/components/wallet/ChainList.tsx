import React, { memo, ReactElement } from 'react';
import { Children } from '@components/types';
import styles from '@styles/AccountSelector.module.css';
import {
  Box,
  CircularProgress,
  IconButton,
  createStyles,
  makeStyles,
  Theme,
  ButtonBase,
} from '@material-ui/core';
import Image from 'material-ui-image';
import BitcoinIcon from 'mdi-material-ui/Bitcoin';
import EthereumIcon from 'mdi-material-ui/Ethereum';

interface ChainListProps extends Children {}

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
  })
);

function ChainList({ children }: ChainListProps): ReactElement<ChainListProps> {
  const classes = useStyles();
  return (
    <>
      <Box
        flexShrink={0}
        bgcolor="primary.dark"
        padding={1}
        className={styles.content}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <ButtonBase focusRipple>
          <Box p={1.5}>
            <Box className={classes.small}>
              <Image
                src="/img/loading.png"
                aspectRatio={1}
                loading={<CircularProgress size={24} />}
                color="transparent"
                imageStyle={{
                  filter: 'grayscale(0)',
                }}
              />
            </Box>
          </Box>
        </ButtonBase>
        <IconButton color="default" disabled>
          <BitcoinIcon />
        </IconButton>
        <IconButton color="default" disabled>
          <EthereumIcon />
        </IconButton>
      </Box>
      {children}
    </>
  );
}

export default memo(ChainList);
