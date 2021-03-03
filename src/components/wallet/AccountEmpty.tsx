import React, { memo, ReactElement } from 'react';
import { Children } from '@components/types';
import {
  Avatar,
  Card,
  CardHeader,
  Divider,
  Typography,
} from '@material-ui/core';
import { useChain } from '@components/polkadot/hook';

interface AccountEmptyProps extends Children {}

function AccountEmpty({
  children,
}: AccountEmptyProps): ReactElement<AccountEmptyProps> {
  const { systemName } = useChain();

  return (
    <>
      <Card>
        <CardHeader
          avatar={<Avatar sizes="40">N</Avatar>}
          title="[尚未添加账户]"
          titleTypographyProps={{ variant: 'button' }}
          subheader={systemName}
          subheaderTypographyProps={{ variant: 'caption' }}
        ></CardHeader>
        <Divider />
        <Typography variant="caption" gutterBottom>
          请您添加账户
        </Typography>
      </Card>
      {children}
    </>
  );
}

export default memo(AccountEmpty);
