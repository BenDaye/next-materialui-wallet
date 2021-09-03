import { Box } from '@material-ui/core';

import React from 'react';
import { PageHeader } from '@components/common';
import { RestoreAccountParams } from '@components/account';
import { useRouter } from 'next/router';

export default function RestoreAccountPage() {
  const router = useRouter();
  const { chain } = router.query;

  return (
    <>
      <PageHeader title={`导入${chain}账户`} />
      <Box py={1}>
        <RestoreAccountParams />
      </Box>
    </>
  );
}
