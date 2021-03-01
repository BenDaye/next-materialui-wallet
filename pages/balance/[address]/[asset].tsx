import {
  PotentialBalance,
  TransferList,
  useApi,
  useCall,
  useChain,
  useError,
  usePotentialBalances,
} from '@components';
import { useRouter } from 'next/router';
import React, { ChangeEvent, memo, useEffect, useMemo, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Box,
  Button,
} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import DescriptionIcon from '@material-ui/icons/Description';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import TransformIcon from '@material-ui/icons/Transform';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { formatBalance } from '@polkadot/util';
import styles from '@styles/Layout.module.css';

function BalancePage() {
  const router = useRouter();
  const {
    query: { address, asset: assetId },
  } = router;
  const { api } = useApi();
  const { setError } = useError();
  const { tokenSymbol } = useChain();
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  // const [{ owner, counterparty, direction }, setTransferListProps] = useState({
  //   owner: null,
  //   counterparty: null,
  //   direction: null,
  // });
  const defaultBalances = useCall<DeriveBalancesAll>(api.derive.balances.all, [
    address,
  ]);

  useEffect(() => {
    if (!address) {
      setError(new TypeError('address is required'));
      router.back();
    }
  }, [address, assetId]);

  const potentialBalances: PotentialBalance[] =
    typeof address === 'string' ? usePotentialBalances({ address }) : [];

  const isPotentialAsset: boolean = useMemo(() => {
    return potentialBalances.some((asset) => asset.assetId === assetId);
  }, [assetId, potentialBalances]);

  const symbol: string = useMemo(() => {
    return isPotentialAsset
      ? potentialBalances.find((asset) => asset.assetId === assetId)?.symbol
      : tokenSymbol;
  }, [isPotentialAsset, tokenSymbol]);

  const balance: string = useMemo(() => {
    if (isPotentialAsset) {
      const potentialBalance = potentialBalances.find(
        (asset) => asset.assetId === assetId
      );

      return potentialBalance
        ? formatBalance(potentialBalance.balance.toString(), {
            withUnit: false,
            withSiFull: true,
            decimals: potentialBalance?.decimals,
          })
        : '-';
    }
    return formatBalance(defaultBalances?.availableBalance, {
      withUnit: false,
      withSiFull: true,
    });
  }, [isPotentialAsset, defaultBalances]);

  const { owner, counterparty, direction } = useMemo(() => {
    const owner = typeof address === 'string' ? address : '';
    switch (currentTabIndex) {
      case 1:
        return { owner, counterparty: null, direction: 1 };
      case 2:
        return { owner, counterparty: null, direction: 2 };
      default:
        return { owner, counterparty: null, direction: null };
    }
  }, [address, symbol, currentTabIndex]);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" onClick={() => router.back()}>
            <ArrowBackIosIcon />
          </IconButton>
          <Box flexGrow={1}>
            <Typography align="center">{symbol}</Typography>
          </Box>
          <IconButton edge="end">
            <DescriptionIcon />
          </IconButton>
        </Toolbar>
        <Toolbar>
          <Box flexGrow={1}>
            <Typography variant="h6" align="center">
              {balance}
            </Typography>
          </Box>
        </Toolbar>
        <Toolbar>
          <Box
            display="flex"
            justifyContent="space-around"
            alignItems="center"
            flexGrow={1}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="caption">锁定</Typography>
              <Typography variant="body2">/</Typography>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="caption">可用</Typography>
              <Typography variant="body2">/</Typography>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="caption">保留</Typography>
              <Typography variant="body2">/</Typography>
            </Box>
          </Box>
        </Toolbar>
        <Tabs
          value={currentTabIndex}
          onChange={(e: ChangeEvent<{}>, v: number) => setCurrentTabIndex(v)}
          variant="fullWidth"
          aria-label="Transfer Navigation Tabs"
        >
          <Tab value={0} label="全部" wrapped />
          <Tab value={1} label="转出" wrapped />
          <Tab value={2} label="转入" wrapped />
        </Tabs>
      </AppBar>
      <Toolbar />
      <Toolbar />
      <Toolbar />
      <Toolbar />
      <TransferList
        symbol={symbol}
        owner={owner}
        counterparty={counterparty}
        direction={direction}
      />
      <Toolbar />
      <AppBar position="fixed" className={styles.bottomNavigation}>
        <Toolbar>
          <Box
            display="flex"
            alignItems="center"
            flexWrap="nowrap"
            flexGrow={1}
          >
            <Box flexGrow={1} mr={1}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                startIcon={<AccountBalanceWalletIcon />}
              >
                收款
              </Button>
            </Box>
            <Box flexGrow={1} ml={1}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                startIcon={<TransformIcon />}
              >
                转账
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default memo(BalancePage);
