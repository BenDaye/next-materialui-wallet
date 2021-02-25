import React, { memo, ReactElement } from 'react';
import { Children } from '@components/types';
import styles from '@styles/AccountPicker.module.css';
import { Box, IconButton } from '@material-ui/core';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';

interface ChainListProps extends Children {}

function ChainList({ children }: ChainListProps): ReactElement<ChainListProps> {
  return (
    <>
      <Box
        flexShrink={0}
        bgcolor="primary.dark"
        padding={1}
        className={styles.content}
      >
        <IconButton color="secondary">
          <AlternateEmailIcon />
        </IconButton>
      </Box>
      {children}
    </>
  );
}

export default memo(ChainList);
