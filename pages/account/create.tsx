import { CreateAccountStepper } from '@components/account';
import { PageHeader } from '@components/common';
import { useChain } from '@@/hook';
import { Toolbar, Box } from '@material-ui/core';
import React from 'react';

export default function CreateAccountPage() {
  const { isChainReady } = useChain();

  return (
    <>
      <PageHeader title="创建账户" />
      <Box py={1}>{isChainReady && <CreateAccountStepper />}</Box>
    </>
  );
}
