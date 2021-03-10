import React, { memo, ReactElement, ReactNode } from 'react';
import type { Children } from '@components/types';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import ChevronLeftIcon from 'mdi-material-ui/ChevronLeft';

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
              <ChevronLeftIcon />
            </IconButton>
          )}
          {left}
          <Box flexGrow={1}>
            {typeof title === 'string' ? (
              <Typography variant="subtitle1">{title}</Typography>
            ) : (
              title
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
