import { useIsMountedRef, useAccounts } from '@@/hook';
import { Box, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@styles/Layout.module.css';
import { NodeIcon } from '@components/common/NodeIcon';

export default function Home() {
  const router = useRouter();
  const { hasAccount } = useAccounts();
  const mountedRef = useIsMountedRef();

  useEffect(() => {
    const logo: HTMLElement = document.getElementById('logo') as HTMLElement;
    if (logo) {
      logo.classList.remove('animate__pulse', 'animate__infinite');
      logo.classList.add('animate__fadeOutUp');

      logo.addEventListener('animationend', redirect);
    }
    return () => {
      logo && logo.removeEventListener('animationend', redirect);
    };
  }, [mountedRef, hasAccount]);

  function redirect() {
    // if (hasAccount) {
    //   router.replace('/wallet');
    // } else {
    //   router.replace('/explorer');
    // }
    router.replace('/wallet');
  }

  return (
    <Box display="flex" className={styles.root}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        marginTop={1}
        flexGrow={1}
      >
        <Box
          id="logo"
          className="animate__animated animate__pulse animate__infinite"
        >
          <Typography variant="h1">
            <NodeIcon name="UECC" fontSize="inherit" />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
