import { Box, Toolbar } from '@material-ui/core';

import React from 'react';
import { PageHeader } from '@components/common';
import { useChain } from '@components/polkadot/hook';
import { AuthRestoreParams } from '@components/auth';

export default function AuthRestorePage() {
  const { isChainReady } = useChain();
  return (
    <>
      <PageHeader title="导入账户" />
      <Box py={1}>{isChainReady && <AuthRestoreParams />}</Box>
      <Toolbar />
    </>
  );
}
