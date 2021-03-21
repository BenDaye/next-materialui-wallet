import React, { memo, ReactElement, useState, useCallback } from 'react';
import type { BaseProps } from '@@/types';
import { useSetting, useNotice } from '@@/hook';
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
} from '@material-ui/core';
import AccountMultiplePlusIcon from 'mdi-material-ui/AccountMultiplePlus';
import CloseIcon from 'mdi-material-ui/Close';
import { useRouter } from 'next/router';
import { NodeIcon } from '@components/setting/components/NodeIcon';

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
  const router = useRouter();

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
      <Dialog open={showDialog} fullScreen disableBackdropClick>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <IconButton edge="start" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            flexGrow={1}
            height="100%"
          >
            <Box className="animate__animated animate__pulse animate__infinite">
              <Typography variant="h1">
                <NodeIcon name={node.name} fontSize="inherit" />
              </Typography>
            </Box>
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
                  router.push('/account/create');
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
                  router.push('/account/restore');
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
