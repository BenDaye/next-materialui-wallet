import { CreateAccountStepper } from '@components/account';
import { PageHeader } from '@components/common';
import { Box } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';

export default function CreateAccountPage() {
  const router = useRouter();
  const { chain } = router.query;
  return (
    <>
      <PageHeader title={`创建${chain}账户`} />
      <Box py={1}>
        <CreateAccountStepper />
      </Box>
    </>
  );
}
