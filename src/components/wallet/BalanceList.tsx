import React, { memo, ReactElement, useEffect, useState } from 'react';
import { Children } from '@components/types';
import {
  useAccounts,
  useApi,
  useBalances,
  useCall,
  useChain,
  usePotentialBalancesByAddress,
} from '@components/polkadot/hook';
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
import { useRouter } from 'next/router';
import { BalanceProps } from '@components/polkadot/context';

interface BalanceListProps extends Children {}

function BalanceList({
  children,
}: BalanceListProps): ReactElement<BalanceListProps> {
  const { api } = useApi();
  const router = useRouter();
  const { currentAccount } = useAccounts();
  // const { tokenSymbol } = useChain();
  // const balancesAll = useCall<DeriveBalancesAll>(api.derive.balances.all, [
  //   currentAccount,
  // ]);

  // const potentialBalances = usePotentialBalancesByAddress({
  //   address: currentAccount,
  // });

  const { balances } = useBalances();

  return (
    <>
      {balances &&
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
        ))}
      {/* {currentAccount && (
        <Box my={1}>
          <Paper
            onClick={() => router.push(`/balance/${currentAccount}/default`)}
          >
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
        </Box>
      )}
      {potentialBalances?.map((balance) => (
        <Box mb={1} key={`potential_balance: ${balance._id}`}>
          <Paper
            onClick={() =>
              router.push(`/balance/${currentAccount}/${balance.assetId}`)
            }
          >
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
        </Box>
      ))} */}
      {children}
    </>
  );
}

export default memo(BalanceList);
