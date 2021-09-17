import React, { memo, ReactElement, useCallback, useState } from 'react';
import type { BaseProps } from '@@/types';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from 'mdi-material-ui/Menu';

import { Chains } from '@components/wallet';
import { ImportAccountButton, Accounts } from './index';
import { useChain } from '@@/hook';
import { AccountProps } from '@components/php/account/types';

interface AccountSelectorProps extends BaseProps {}

function AccountSelector({
  children,
}: AccountSelectorProps): ReactElement<AccountSelectorProps> {
  const [open, setOpen] = useState<boolean>(false);
  const { chains } = useChain();

  const onSelectAccount = useCallback(
    (info: AccountProps) => setOpen(false),
    [chains]
  );

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={() => setOpen(true)}
        disabled={!chains.length}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
        <Box width={1}>
          <AppBar position="static">
            <Toolbar>
              <Box flexGrow={1}>
                <Typography variant="subtitle1">选择账户</Typography>
              </Box>
              <ImportAccountButton />
            </Toolbar>
          </AppBar>
          <Box display="flex" flexWrap="nowrap" width={1}>
            <Chains />
            <Accounts onSelect={onSelectAccount} toDetails={false} select />
          </Box>
        </Box>
      </Drawer>
      {children}
    </>
  );
}

export default memo(AccountSelector);
