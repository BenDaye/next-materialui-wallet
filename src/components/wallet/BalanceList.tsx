import React, { memo, ReactElement } from 'react';
import type { Children } from '@components/types';
import { useAccounts, useBalances, useChain } from '@components/polkadot/hook';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import PaymentIcon from '@material-ui/icons/Payment';
import { useRouter } from 'next/router';
import type { BalanceProps } from '@components/polkadot/context';
import { Skeleton } from '@material-ui/lab';

interface BalanceListProps extends Children {}

function BalanceList({
  children,
}: BalanceListProps): ReactElement<BalanceListProps> {
  const router = useRouter();
  const { isChainReady } = useChain();
  const { currentAccount } = useAccounts();
  const { balances } = useBalances();

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
                  <ListItemIcon>
                    <PaymentIcon />
                  </ListItemIcon>
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
