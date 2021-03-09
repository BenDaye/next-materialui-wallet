import React, { memo, ReactElement } from 'react';
import type { Children } from '@components/types';
import { useAccounts, useBalances, useChain } from '@components/polkadot/hook';
import {
  Avatar,
  Box,
  createStyles,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import PaymentIcon from '@material-ui/icons/Payment';
import { useRouter } from 'next/router';
import type { BalanceProps } from '@components/polkadot/context';
import { Skeleton } from '@material-ui/lab';

interface BalanceListProps extends Children {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
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
  const { currentAccount } = useAccounts();
  const { balances } = useBalances();
  const classes = useStyles();

  return (
    <>
      {isChainReady && balances ? (
        balances.map((b: BalanceProps, index: number) => (
          <Box mb={1} key={`balance: ${index}`}>
            <Paper
              onClick={() =>
                router.push(
                  `/balance/${currentAccount}/${
                    b.isDefault ? 'default' : b.assetId
                  }`
                )
              }
            >
              <List disablePadding>
                <ListItem>
                  {/* <ListItemIcon>
                    <PaymentIcon />
                  </ListItemIcon> */}
                  <ListItemAvatar>
                    <Avatar className={classes.small}>
                      {b.symbol.slice(0, 1)}
                    </Avatar>
                  </ListItemAvatar>
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
                  <PaymentIcon />
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
