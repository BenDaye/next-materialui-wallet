import { useRouter } from 'next/router';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
} from '@material-ui/core';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import React, {
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
  const handleChangeNav = (e, v) => {
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
      <Box flexGrow={1}>{children}</Box>
      {isMainRouter && (
        <Box flexShrink={0}>
          <BottomNavigation value={nav} onChange={handleChangeNav}>
            <BottomNavigationAction
              label="钱包"
              value="/wallet"
              icon={<RestoreIcon />}
            />
            <BottomNavigationAction
              label="市场"
              value="/market"
              icon={<FavoriteIcon />}
            />
            <BottomNavigationAction
              label="浏览"
              value="/explorer"
              icon={<LocationOnIcon />}
            />
            <BottomNavigationAction
              label="设置"
              value="/settings"
              icon={<LocationOnIcon />}
            />
          </BottomNavigation>
        </Box>
      )}
    </Box>
  );
}

export default memo(Layout);
