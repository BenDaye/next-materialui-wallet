import { useRouter } from 'next/router';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Toolbar,
} from '@material-ui/core';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import ExploreIcon from '@material-ui/icons/Explore';
import SettingsIcon from '@material-ui/icons/Settings';
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
    <Box
      display="flex"
      flexDirection="column"
      flexWrap="nowrap"
      className={styles.root}
    >
      <Box
        display="flex"
        flexDirection="column"
        flexWrap="nowrap"
        flexGrow={1}
        className={styles.content}
      >
        {children}
        {isMainRouter && <Toolbar />}
      </Box>
      {isMainRouter && (
        <AppBar position="fixed" className={styles.bottomNavigation}>
          <BottomNavigation value={nav} onChange={handleChangeNav}>
            <BottomNavigationAction
              label="钱包"
              value="/wallet"
              icon={<AccountBalanceWalletIcon />}
            />
            <BottomNavigationAction
              label="行情"
              value="/market"
              icon={<ShowChartIcon />}
            />
            <BottomNavigationAction
              label="浏览"
              value="/explorer"
              icon={<ExploreIcon />}
            />
            <BottomNavigationAction
              label="设置"
              value="/settings"
              icon={<SettingsIcon />}
            />
          </BottomNavigation>
        </AppBar>
      )}
    </Box>
  );
}

export default memo(Layout);
