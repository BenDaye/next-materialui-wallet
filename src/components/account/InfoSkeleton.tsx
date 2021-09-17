import React, { memo, ReactElement } from 'react';
import type { BaseProps } from '@@/types';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useChain } from '@@/hook';

interface AccountInfoSkeletonProps extends BaseProps {
  primary?: string;
  secondary?: string;
}

function AccountInfoSkeleton({
  children,
  primary = '[尚未添加账户]',
  secondary = '请您添加账户',
}: AccountInfoSkeletonProps): ReactElement<AccountInfoSkeletonProps> {
  const { chains } = useChain();

  if (chains.length) {
    return (
      <Paper>
        <List dense>
          <ListItem>
            <ListItemAvatar>
              <Avatar>N</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={primary}
              primaryTypographyProps={{ variant: 'body1' }}
              secondary={secondary}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </ListItem>
        </List>
      </Paper>
    );
  }
  return (
    <Paper>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Skeleton variant="circle">
              <Avatar>N</Avatar>
            </Skeleton>
          </ListItemAvatar>
          <Skeleton>
            <ListItemText
              primary={primary}
              primaryTypographyProps={{ variant: 'body1' }}
              secondary={secondary}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </Skeleton>
        </ListItem>
      </List>
    </Paper>
  );
}

export default memo(AccountInfoSkeleton);
