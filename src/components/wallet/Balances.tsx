import React, { memo, ReactElement, useEffect, useState } from 'react';
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
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { Skeleton } from '@material-ui/lab';
import BitcoinIcon from 'mdi-material-ui/Bitcoin';
import { useAccounts, useCurrentAccount } from '@@/hook';
import { BalanceProps } from '@components/php/balance/types';
import useFetch from 'use-http';

interface BalancesProps extends BaseProps {}

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

function Balances({ children }: BalancesProps): ReactElement<BalancesProps> {
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
            <Paper>
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
                    <Button
                      size="small"
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

export default memo(Balances);
