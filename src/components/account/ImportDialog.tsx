import { useChain, useCurrentChain } from '@@/hook';
import { BaseProps } from '@@/types';
import { Chain } from '@components/php/chain/types';
import {
  Box,
  Menu,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  MenuItem,
  DialogActions,
  Button,
} from '@material-ui/core';
import CloseIcon from 'mdi-material-ui/Close';
import ChevronRightIcon from 'mdi-material-ui/ChevronRight';
import { useRouter } from 'next/router';
import React, { memo, ReactElement, useEffect, useState } from 'react';

interface ImportAccountDialogProps extends BaseProps {
  show: boolean;
  onClose: () => void;
}

function ImportAccountDialog({
  children,
  show,
  onClose = () => {},
}: ImportAccountDialogProps): ReactElement<ImportAccountDialogProps> | null {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<any>(null);

  const { chains } = useChain();
  const currentChain = useCurrentChain();
  const [chain_type, setChainType] = useState<String>(
    () => currentChain?.name || chains[0]?.name || ''
  );

  useEffect(() => {
    if (chain_type || !chains.length) return;
    if (currentChain) setChainType(currentChain.name);
    else setChainType(chains[0]?.name);
  }, [chains, currentChain, chain_type]);

  const handleClose = (_: any, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick') return;
    onClose();
  };

  return (
    <Dialog open={show} fullScreen onClose={handleClose}>
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
                onClose();
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
                onClose();
              }}
            >
              导入账户
            </Button>
          </Toolbar>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default memo(ImportAccountDialog);
