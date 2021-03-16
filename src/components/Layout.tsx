import { useRouter } from 'next/router';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Toolbar,
} from '@material-ui/core';
import WalletIcon from 'mdi-material-ui/Wallet';
import ChartScatterPlotHexbinIcon from 'mdi-material-ui/ChartScatterPlotHexbin';
import ViewDashboardIcon from 'mdi-material-ui/ViewDashboard';
import CogsIcon from 'mdi-material-ui/Cogs';
import React, {
  ChangeEvent,
  memo,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import styles from '@styles/Layout.module.css';
import { Children } from './types';

function Layout({ children }: Children): ReactElement<Children> | null {
  const router = useRouter();
  const mainRouters: String[] = [
    '/wallet',
    '/market',
    '/explorer',
    '/settings',
  ];

  const [isMainRouter, setIsMainRouter] = useState(false);
  const [nav, setNav] = useState('/wallet');
  const handleChangeNav = (e: ChangeEvent<{}>, v: string) => {
    router.push(v);
  };

  useEffect(() => {
    setIsMainRouter(mainRouters.includes(router.route));
    setNav(router.route);
  }, [router]);

  return (
    <Box>
      {children}
      {isMainRouter && (
        <>
          <Toolbar />
          <AppBar position="fixed" className={styles.bottomNavigation}>
            <BottomNavigation value={nav} onChange={handleChangeNav}>
              <BottomNavigationAction
                label="钱包"
                value="/wallet"
                icon={<WalletIcon />}
              />
              <BottomNavigationAction
                label="行情"
                value="/market"
                icon={<ChartScatterPlotHexbinIcon />}
              />
              <BottomNavigationAction
                label="浏览"
                value="/explorer"
                icon={<ViewDashboardIcon />}
              />
              <BottomNavigationAction
                label="设置"
                value="/settings"
                icon={<CogsIcon />}
              />
            </BottomNavigation>
          </AppBar>
        </>
      )}
    </Box>
  );
}

export default memo(Layout);
