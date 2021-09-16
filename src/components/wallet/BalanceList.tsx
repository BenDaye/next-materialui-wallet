import React, { memo, ReactElement, useEffect, useMemo, useState } from 'react';
import type { BaseProps } from '@@/types';
import {
  Avatar,
  Box,
  Button,
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
import { useRouter } from 'next/router';
import { Skeleton } from '@material-ui/lab';
import BitcoinIcon from 'mdi-material-ui/Bitcoin';
import { useChain } from '@components/php/chain/hook';
import { useAccounts, useCurrentAccount } from '@components/php/account/hook';
import { useBalance } from '@components/php/balance/hook';
import { BalanceProps } from '@components/php/balance/types';
import useFetch from 'use-http';

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
    icon: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
  })
);

function BalanceList({
  children,
}: BalanceListProps): ReactElement<BalanceListProps> {
  const router = useRouter();
  const { get, response } = useFetch('/chain');

  const { accounts, hasAccount } = useAccounts();
  const currentAccount = useCurrentAccount(accounts);

  const [balance, setBalance] = useState<BalanceProps>({
    address: '',
    balance: '',
    balance_int: '',
    decimals: '',
  });

  useEffect(() => {
    if (currentAccount) {
      getBalance();
    }
  }, [currentAccount]);

  const getBalance = async () => {
    if (!currentAccount) return;
    const { uuid, chain_type, address } = currentAccount;
    const { status, data } = await get(
      `/getBalanceByAddress?chain_type=${chain_type}&uuid=${uuid}&address=${address}`
    );
    if (!response.ok) return;
    if (status === 1) setBalance(data);
  };

  const classes = useStyles();

  return (
    <>
      {currentAccount && balance ? (
        [balance].map((b: BalanceProps, index: number) => (
          <Box mb={1} key={`balance: ${index}`}>
            <Paper
            // onClick={() => router.push(`/balance/${currentAccount.uuid}`)}
            >
              <List disablePadding>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      src={`/img/${currentAccount.chain_type}@2x.png`}
                      variant="circular"
                      className={classes.icon}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={currentAccount.chain_type}
                    secondary={b.balance}
                  />
                  <ListItemSecondaryAction>
                    {/* <Typography variant="body2">{b.balance}</Typography> */}
                    <Button
                      variant="outlined"
                      onClick={() =>
                        router.push(`/transfer/${currentAccount.uuid}`)
                      }
                    >
                      转账
                    </Button>
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
