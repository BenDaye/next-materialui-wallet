import React, {
  memo,
  ReactElement,
  useState,
  useCallback,
  useEffect,
} from 'react';
import type { BaseProps } from '@@/types';
import { useSetting, useNotice, useIsMountedRef } from '@@/hook';
import {
  Box,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  AppBar,
  Toolbar,
  Typography,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Menu,
  MenuItem,
} from '@material-ui/core';
import AccountMultiplePlusIcon from 'mdi-material-ui/AccountMultiplePlus';
import CloseIcon from 'mdi-material-ui/Close';
import ChevronRightIcon from 'mdi-material-ui/ChevronRight';
import { useRouter } from 'next/router';
import { NodeIcon } from '@components/setting/components/NodeIcon';
import { useChain } from '@components/php/chain/hook';
import { Chain } from '@components/php/chain/types';

interface ImportAccountButtonProps extends BaseProps {
  edge?: 'start' | 'end' | false;
}

function ImportAccountButtonBase({
  children,
  edge = 'end',
}: ImportAccountButtonProps): ReactElement<ImportAccountButtonProps> {
  const { node } = useSetting();
  const { showError } = useNotice();
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const { chains } = useChain();
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [chain_type, setChainType] = useState<String>('');
  const router = useRouter();
  const mountedRef = useIsMountedRef();

  useEffect(() => {
    if (chains.length) setChainType(chains[0]?.name);
  }, [mountedRef, chains]);

  const onShow = useCallback(() => {
    setShowDialog(true);
  }, []);

  const onClose = useCallback(() => {
    setShowDialog(false);
  }, []);

  return (
    <>
      <IconButton edge={edge} onClick={onShow}>
        <AccountMultiplePlusIcon />
      </IconButton>
      <Dialog open={showDialog} fullScreen>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <IconButton edge="start" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Box height="100%">
            <List>
              <ListItem
                button
                onClick={(event) => {
                  setAnchorEl(event.currentTarget);
                  setShowMenu(true);
                }}
                selected
              >
                <ListItemText primary={chain_type} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="link">
                    <ChevronRightIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={showMenu}
              onClose={() => setShowMenu(false)}
            >
              {chains.map((c: Chain) => (
                <MenuItem
                  key={c.name}
                  selected={c.name === chain_type}
                  onClick={() => {
                    setAnchorEl(null);
                    setChainType(c.name);
                    setShowMenu(false);
                  }}
                >
                  {c.full_name}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </DialogContent>
        <DialogActions>
          <Box flexGrow={1}>
            <Toolbar>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={() => {
                  router.push(`/account/create/${chain_type}`);
                }}
              >
                创建账户
              </Button>
            </Toolbar>
            <Toolbar>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={() => {
                  router.push(`/account/restore/${chain_type}`);
                }}
              >
                导入账户
              </Button>
            </Toolbar>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}

export const ImportAccountButton = memo(ImportAccountButtonBase);
