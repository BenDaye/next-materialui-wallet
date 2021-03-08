import React, { memo, ReactElement } from 'react';
import type { Children } from '@components/types';
import { AppBar } from '@material-ui/core';
import styles from '@styles/Layout.module.css';

interface PageFooterProps extends Children {}

function PageFooter({
  children,
}: PageFooterProps): ReactElement<PageFooterProps> {
  return (
    <>
      <AppBar
        position="fixed"
        className={styles.bottomNavigation}
        color="inherit"
      >
        {children}
      </AppBar>
    </>
  );
}

export default memo(PageFooter);
