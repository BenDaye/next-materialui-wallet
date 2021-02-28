import React, { memo, ReactElement, useState } from 'react';
import { Children } from '@components/types';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChainList from './ChainList';
import AccountList from './AccountList';

interface AccountPickerProps extends Children {}

function AccountPicker({
  children,
}: AccountPickerProps): ReactElement<AccountPickerProps> {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={() => setOpen(true)}
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
              <IconButton edge="end" color="inherit" aria-label="scan">
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box display="flex" flexWrap="nowrap" width={1}>
            <ChainList />
            <AccountList />
          </Box>
        </Box>
      </Drawer>
      {children}
    </>
  );
}

export default memo(AccountPicker);
