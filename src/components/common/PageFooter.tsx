import React, { memo, ReactElement } from 'react';
import type { BaseProps } from '@@/types';
import { AppBar } from '@material-ui/core';
import styles from '@styles/Layout.module.css';

interface PageFooterProps extends BaseProps {}

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
