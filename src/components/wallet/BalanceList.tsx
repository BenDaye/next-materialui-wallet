import React, { memo, ReactElement } from 'react';
import type { BaseProps } from '@@/types';
import { useAccount, useBalance, useChain } from '@@/hook';
import {
  Box,
  createStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import type { BalanceProps } from '@components/polkadot/balance/types';
import { Skeleton } from '@material-ui/lab';
import BitcoinIcon from 'mdi-material-ui/Bitcoin';

interface BalanceListProps extends BaseProps {}

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

function BalanceList({
  children,
}: BalanceListProps): ReactElement<BalanceListProps> {
  const router = useRouter();
  const { isChainReady } = useChain();
  const { currentAccount } = useAccount();
  const balances = useBalance(currentAccount);
  const classes = useStyles();

  return (
    <>
      {isChainReady && balances ? (
        balances.map((b: BalanceProps, index: number) => (
          <Box mb={1} key={`balance: ${index}`}>
            <Paper
              onClick={() =>
                router.push(`/balance/${currentAccount}/${b.assetId}`)
              }
            >
              <List disablePadding>
                <ListItem>
                  <ListItemIcon>
                    <BitcoinIcon />
                  </ListItemIcon>
                  {/* <ListItemAvatar>
                    <Avatar className={classes.small}>
                      {b.symbol.slice(0, 1)}
                    </Avatar>
                  </ListItemAvatar> */}
                  <ListItemText primary={b.symbol} />
                  <ListItemSecondaryAction>
                    <Typography variant="body2">{b.balanceFormat}</Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>
          </Box>
        ))
      ) : (
        <Box mb={1}>
          <Paper>
            <List disablePadding>
              <ListItem>
                <ListItemIcon>
                  <BitcoinIcon />
                </ListItemIcon>
                <ListItemText primary={<Skeleton />} />
              </ListItem>
            </List>
          </Paper>
        </Box>
      )}
      {children}
    </>
  );
}

export default memo(BalanceList);
