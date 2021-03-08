import React, { memo, ReactElement, ReactNode } from 'react';
import type { Children } from '@components/types';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useRouter } from 'next/router';

interface PageHeaderProps extends Children {
  showBack?: boolean;
  left?: ReactNode;
  right?: ReactNode;
  title: string | ReactNode;
}

function PageHeader({
  children,
  title,
  showBack = true,
  left,
  right,
}: PageHeaderProps): ReactElement<PageHeaderProps> {
  const router = useRouter();
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {showBack && (
            <IconButton edge="start" onClick={() => router.back()}>
              <ArrowBackIosIcon />
            </IconButton>
          )}
          {left}
          <Box flexGrow={1}>
            {typeof title === 'string' ? (
              <Typography>{title}</Typography>
            ) : (
              { title }
            )}
          </Box>
          {right}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}

export default memo(PageHeader);
