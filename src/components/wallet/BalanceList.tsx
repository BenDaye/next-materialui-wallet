import React, { memo, ReactElement, useEffect, useState } from 'react';
import { Children } from '@components/types';
import { useAccounts, useApi, useCall, useChain } from '@components/polkadot';
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
import useFetch from 'use-http';
import { createTypeUnsafe } from '@polkadot/types';
import type { Codec } from '@polkadot/types/types';

interface BalanceListProps extends Children {}

interface Asset {
  account: string;
  assetId: string;
  decimals: number;
  key: string;
  symbol: string;
  type: string;
  _id: string;
}

interface PotentialBalancesResponse {
  success: boolean;
  result: Asset[];
}

interface PotentialBalance extends Asset {
  balance: Codec;
}

function BalanceList({
  children,
}: BalanceListProps): ReactElement<BalanceListProps> {
  const { api } = useApi();
  const { currentAccount } = useAccounts();
  const { tokenSymbol } = useChain();
  const balancesAll = useCall<DeriveBalancesAll>(api.derive.balances.all, [
    currentAccount,
  ]);

  const { get, response, loading, error } = useFetch(
    'http://221.122.102.163:4000'
  );

  const [assets, setAssets] = useState<Asset[]>([]);
  useEffect(() => {
    if (currentAccount) getAssets();
  }, [currentAccount]);

  async function getAssets() {
    const { success, result }: PotentialBalancesResponse = await get(
      `/potential_balances?account=${currentAccount}`
    );
    if (response.ok && success) {
      setAssets(result);
    }
  }

  const [balances, setBalances] = useState<PotentialBalance[]>([]);
  useEffect(() => {
    getBalances();
  }, [assets]);

  async function getBalances() {
    const keys = assets.map((asset) =>
      createTypeUnsafe(api.registry, '(Hash, AccountId)', [
        [asset.assetId, currentAccount],
      ])
    );

    const result: Codec[] = await Promise.all(
      keys.map((key) => api.query['urc10Module'].balances(key.toHex()))
    );

    setBalances(
      assets.map((asset, index) => ({ ...asset, balance: result[index] }))
    );
  }

  return (
    <>
      {currentAccount && (
        <Box my={1}>
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
        </Box>
      )}
      {balances?.map((balance) => (
        <Box mb={1} key={`potential_balance: ${balance._id}`}>
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
        </Box>
      ))}
      {children}
    </>
  );
}

export default memo(BalanceList);
