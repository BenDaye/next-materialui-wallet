import { AuthCreateStepper } from '@components/auth';
import { useChain } from '@components/polkadot/hook';
import {
  AppBar,
  Button,
  Toolbar,
  Container,
  IconButton,
  Typography,
  Box,
  Fade,
  Paper,
  Slide,
} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import styles from '@styles/Layout.module.css';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

export default function AuthCreatePage() {
  const router = useRouter();
  const { isChainReady } = useChain();

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" onClick={() => router.back()}>
            <ArrowBackIosIcon />
          </IconButton>
          <Box flexGrow={1}>
            <Typography>创建账户</Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box py={1}>{isChainReady && <AuthCreateStepper />}</Box>
      <Toolbar />
      <Toolbar />
    </>
  );
}
