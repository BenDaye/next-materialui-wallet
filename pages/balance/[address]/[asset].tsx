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
  useAccount,
  useAccountBaseByAddress,
  useApi,
  useBalance,
  useCall,
  useChain,
  useSortedAccounts,
  useUrc10ModuleAssetBalance,
} from '@@/hook';
import { useError } from '@@/hook';
import type { BalanceProps } from '@components/polkadot/balance/types';
import { TransferListProvider } from '@components/transfer/List';
import { getShortAddress } from '@utils/getShortAddress';
import { getSortedAccountName } from '@utils/getSortedAccountName';

export default function BalancePage() {
  const router = useRouter();
  const {
    query: { address, asset: assetId },
  } = router;
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const accountBase = useAccountBaseByAddress(
    typeof address === 'string' ? address : null
  );

  const balances = useBalance(typeof address === 'string' ? address : null);

  const thisBalance = useMemo(
    () => balances.find((b) => b.assetId === assetId),
    [balances]
  );

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
  }, [address, currentTabIndex]);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" onClick={() => router.back()}>
            <ChevronLeftIcon />
          </IconButton>
          <Box flexGrow={1}>
            <Typography variant="subtitle1" align="center">
              {accountBase?.name || ''}
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
        <TransferListProvider
          symbol={thisBalance.symbol}
          owner={owner}
          counterparty={counterparty}
          direction={direction}
        />
      )}
      {accountBase && (
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
