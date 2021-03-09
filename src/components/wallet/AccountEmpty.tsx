import React, { memo, ReactElement } from 'react';
import { Children } from '@components/types';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Divider,
  Typography,
} from '@material-ui/core';
import { useChain } from '@components/polkadot/hook';
import { Skeleton } from '@material-ui/lab';

interface AccountEmptyProps extends Children {}

function AccountEmpty({
  children,
}: AccountEmptyProps): ReactElement<AccountEmptyProps> {
  const { systemName, isChainReady } = useChain();

  return (
    <>
      {isChainReady ? (
        <Card>
          <CardHeader
            avatar={<Avatar>N</Avatar>}
            title="[尚未添加账户]"
            titleTypographyProps={{ variant: 'button' }}
            subheader={systemName}
            subheaderTypographyProps={{ variant: 'caption' }}
          ></CardHeader>
          <Divider />
          <Box px={2} py={1}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="caption" gutterBottom>
                请您添加账户
              </Typography>
            </Box>
          </Box>
        </Card>
      ) : (
        <Card>
          <CardHeader
            avatar={
              <Skeleton variant="circle">
                <Avatar>N</Avatar>
              </Skeleton>
            }
            title={<Skeleton />}
            titleTypographyProps={{ variant: 'button' }}
            subheader={<Skeleton />}
            subheaderTypographyProps={{ variant: 'caption' }}
          ></CardHeader>
          <Divider />
          <Box py={1} px={2}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="caption" gutterBottom>
                <Skeleton width={48} />
              </Typography>
              <Typography variant="caption" gutterBottom>
                <Skeleton width={120} />
              </Typography>
            </Box>
          </Box>
        </Card>
      )}

      {children}
    </>
  );
}

export default memo(AccountEmpty);
