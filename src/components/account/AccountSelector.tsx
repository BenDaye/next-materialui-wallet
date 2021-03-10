import React, { memo, ReactElement, useCallback, useState } from 'react';
import { Children } from '@components/types';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import AccountMultiplePlusIcon from 'mdi-material-ui/AccountMultiplePlus';
import MenuIcon from 'mdi-material-ui/Menu';

import ChainList from '../wallet/ChainList';
import { useRouter } from 'next/router';
import { UseAccountInfo, useChain } from '@components/polkadot/hook';
import AccountSelectorList from './AccountSelectorList';

interface AccountSelectorProps extends Children {}

function AccountSelector({
  children,
}: AccountSelectorProps): ReactElement<AccountSelectorProps> {
  const router = useRouter();
  const { isChainReady } = useChain();
  const [open, setOpen] = useState<boolean>(false);

  const onSelectAccount = useCallback(
    (info: UseAccountInfo) => setOpen(false),
    [isChainReady]
  );
  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={() => setOpen(true)}
        disabled={!isChainReady}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
        <Box width={1}>
          <AppBar position="static">
            <Toolbar>
              <Box flexGrow={1}>
                <Typography variant="subtitle2">选择账户</Typography>
              </Box>
              <IconButton edge="end" onClick={() => router.push('/auth')}>
                <AccountMultiplePlusIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box display="flex" flexWrap="nowrap" width={1}>
            <ChainList />
            <AccountSelectorList onSelect={onSelectAccount} />
          </Box>
        </Box>
      </Drawer>
      {children}
    </>
  );
}

export default memo(AccountSelector);
