import React, { memo, ReactElement } from 'react';
import { CircularProgress } from '@material-ui/core';
import styles from '@styles/ButtonWithLoading.module.css';
import type { Children } from '@components/types';

interface ButtonWithLoadingProps extends Children {
  loading?: boolean;
}

function ButtonWithLoading({
  children,
  loading = false,
}: ButtonWithLoadingProps): ReactElement<ButtonWithLoadingProps> {
  return (
    <div className={styles.buttonBase}>
      {children}
      {loading && (
        <CircularProgress
          size={24}
          className={styles.buttonLoading}
          color="secondary"
        />
      )}
    </div>
  );
}

export default memo(ButtonWithLoading);
