import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Container,
  Button,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import router from 'next/router';
import Image from 'next/image';
import React, { useCallback } from 'react';
import { useAccounts } from '@components/polkadot/hook';
import styles from '@styles/Layout.module.css';

export default function AuthPage() {
  const { hasAccount } = useAccounts();
  const handleClose = useCallback(() => {
    if (hasAccount) {
      router.back();
    } else {
      router.replace('/explorer');
    }
  }, [hasAccount]);
  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <IconButton edge="start" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        marginTop={1}
        flexGrow={1}
      >
        <Box className="animate__animated animate__pulse animate__infinite">
          <Image src="/img/loading.png" alt="logo" height="80" width="80" />
        </Box>
      </Box>
      <Toolbar />
      <Toolbar />
      <Toolbar />
      <AppBar
        position="fixed"
        className={styles.bottomNavigation}
        elevation={0}
        color="transparent"
      >
        <Toolbar>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            onClick={() => {
              router.push('/auth/create');
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
              router.push('/auth/restore');
            }}
          >
            导入账户
          </Button>
        </Toolbar>
        <Toolbar />
      </AppBar>
    </>
  );
}
