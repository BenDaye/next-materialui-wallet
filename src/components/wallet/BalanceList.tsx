import React, { memo, ReactElement, useEffect, useState } from 'react';
import { Children } from '@components/types';
import {
  useAccounts,
  useApi,
  useCall,
  useChain,
  usePotentialBalances,
} from '@components/polkadot';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
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
import { formatBalance } from '@polkadot/util';
import Link from 'next/link';

interface BalanceListProps extends Children {}

function BalanceList({
  children,
}: BalanceListProps): ReactElement<BalanceListProps> {
  const { api } = useApi();
  const { currentAccount } = useAccounts();
  const { tokenSymbol } = useChain();
  const balancesAll = useCall<DeriveBalancesAll>(api.derive.balances.all, [
    currentAccount,
  ]);

  const potentialBalances = usePotentialBalances({ address: currentAccount });

  return (
    <>
      {currentAccount && (
        <Box my={1}>
          <Link href={`/balance/${currentAccount}/default`}>
            <Paper>
              <List disablePadding>
                <ListItem>
                  <ListItemIcon>
                    <PaymentIcon />
                  </ListItemIcon>
                  <ListItemText primary={tokenSymbol} />
                  <ListItemSecondaryAction>
                    <Typography>
                      {formatBalance(balancesAll?.availableBalance, {
                        withSiFull: true,
                        withUnit: false,
                      })}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>
          </Link>
        </Box>
      )}
      {potentialBalances?.map((balance) => (
        <Box mb={1} key={`potential_balance: ${balance._id}`}>
          <Link href={`/balance/${currentAccount}/${balance.assetId}`}>
            <Paper>
              <List disablePadding>
                <ListItem>
                  <ListItemIcon>
                    <PaymentIcon />
                  </ListItemIcon>
                  <ListItemText primary={balance.symbol} />
                  <ListItemSecondaryAction>
                    <Typography>
                      {formatBalance(balance?.balance.toString(), {
                        withSiFull: true,
                        withUnit: false,
                        decimals: balance.decimals,
                      })}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>
          </Link>
        </Box>
      ))}
      {children}
    </>
  );
}

export default memo(BalanceList);
