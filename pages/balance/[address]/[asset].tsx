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
import ChevronLeftIcon from 'mdi-material-ui/ChevronLeft';
import NewspaperVariantIcon from 'mdi-material-ui/NewspaperVariant';
import QrcodeIcon from 'mdi-material-ui/Qrcode';
import CreditCardIcon from 'mdi-material-ui/CreditCard';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { formatBalance, isFunction } from '@polkadot/util';
import styles from '@styles/Layout.module.css';
import {
  Urc10Balance,
  useAccounts,
  useApi,
  useCall,
  useChain,
  useUrc10ModuleBalances,
} from '@components/polkadot/hook';
import { useError } from '@components/error';
import { BalanceProps } from '@components/polkadot/context';
import { TransferList } from '@components/balance';
import { getShortAddress } from '@utils/getShortAddress';
import { getSortedAccountName } from '@utils/getSortedAccountName';

export default function BalancePage() {
  const router = useRouter();
  const {
    query: { address, asset: assetId },
  } = router;
  const { api, isApiReady } = useApi();
  const { setError } = useError();
  const { tokenSymbol, tokenDecimals } = useChain();
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const {
    currentAccount,
    isAccount,
    hasAccount,
    sortedAccounts,
  } = useAccounts();

  useEffect(() => {
    if (!address) {
      setError(new TypeError('address is required'));
      router.back();
    }
  }, [address, assetId]);

  const title = useMemo(() => {
    const _address = typeof address === 'string' ? address : null;
    if (!_address) return '/';
    if (!isAccount(_address)) {
      return getShortAddress(_address);
    }
    const theAccount = sortedAccounts.find(
      (ac) => ac.account.address === _address
    );
    return theAccount ? getSortedAccountName(theAccount) : '';
  }, [hasAccount, isAccount, sortedAccounts, address]);

  const showBottomNavigation = useMemo(
    () => typeof address === 'string' && isAccount(address),
    [hasAccount, isAccount, sortedAccounts, address]
  );

  const defaultAssetBalance = useCall<DeriveBalancesAll>(
    isApiReady &&
      isFunction(api.derive.balances.all) &&
      api.derive.balances.all,
    [address]
  );
  const urc10ModuleAssetsBalance: Urc10Balance[] =
    typeof address === 'string' ? useUrc10ModuleBalances(address) : [];

  const isUrc10ModuleAsset: boolean = useMemo(() => {
    return urc10ModuleAssetsBalance.some((asset) => asset.assetId === assetId);
  }, [assetId, urc10ModuleAssetsBalance]);

  const thisBalance: BalanceProps | undefined = useMemo(() => {
    if (!isUrc10ModuleAsset) {
      return {
        symbol: tokenSymbol && tokenSymbol[0],
        decimals: tokenDecimals && tokenDecimals[0] && Number(tokenDecimals[0]),
        isDefault: true,
        balanceFormat:
          defaultAssetBalance &&
          defaultAssetBalance.availableBalance &&
          formatBalance(defaultAssetBalance.availableBalance, {
            withSiFull: true,
            withUnit: true,
          }),
      };
    }
    const _po = urc10ModuleAssetsBalance.find((pb) => pb.assetId === assetId);
    return (
      _po && {
        assetId: _po.assetId,
        symbol: _po.symbol,
        decimals: _po.decimals,
        isDefault: false,
        balance: _po.balance,
        balanceFormat:
          _po.balance &&
          formatBalance(_po.balance.toString(), {
            withSiFull: true,
            withUnit: _po.symbol,
            decimals: _po.decimals,
          }),
      }
    );
  }, [
    currentAccount,
    isUrc10ModuleAsset,
    urc10ModuleAssetsBalance,
    defaultAssetBalance,
    address,
    assetId,
  ]);

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
  }, [address, thisBalance, currentTabIndex]);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" onClick={() => router.back()}>
            <ChevronLeftIcon />
          </IconButton>
          <Box flexGrow={1}>
            <Typography variant="subtitle1" align="center">
              {title}
            </Typography>
          </Box>
          <IconButton edge="end">
            <NewspaperVariantIcon />
          </IconButton>
        </Toolbar>
        <Toolbar variant="dense">
          <Box flexGrow={1}>
            <Typography variant="h6" align="center">
              {thisBalance?.balanceFormat || '/'}
            </Typography>
          </Box>
        </Toolbar>
        <Toolbar variant="dense">
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
      <Toolbar variant="dense" />
      <Toolbar variant="dense" />
      <Toolbar />
      {thisBalance && (
        <TransferList
          symbol={thisBalance.symbol?.toString()}
          owner={owner}
          counterparty={counterparty}
          direction={direction}
        />
      )}
      {showBottomNavigation && (
        <>
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
                    startIcon={<QrcodeIcon />}
                  >
                    收款
                  </Button>
                </Box>
                <Box flexGrow={1} ml={1}>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    startIcon={<CreditCardIcon />}
                    onClick={() => router.push('/transfer')}
                  >
                    转账
                  </Button>
                </Box>
              </Box>
            </Toolbar>
          </AppBar>
        </>
      )}
    </>
  );
}
