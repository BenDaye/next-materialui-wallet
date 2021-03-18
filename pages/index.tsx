import { useAccount, useChain } from '@@/hook';
import { Box } from '@material-ui/core';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '@styles/Layout.module.css';

export default function Home() {
  const router = useRouter();
  const { hasAccount } = useAccount();
  const { isChainReady } = useChain();

  useEffect(() => {
    const logo: HTMLElement = document.getElementById('logo') as HTMLElement;
    if (logo && isChainReady) {
      logo.classList.remove('animate__pulse', 'animate__infinite');
      logo.classList.add('animate__fadeOutUp');

      logo.addEventListener('animationend', redirect);
    }
    return () => {
      logo && logo.removeEventListener('animationend', redirect);
    };
  }, [isChainReady, hasAccount]);

  function redirect() {
    if (hasAccount) {
      router.replace('/wallet');
    } else {
      router.replace('/explorer');
    }
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
          <Image src="/img/loading.png" alt="logo" height="80" width="80" />
        </Box>
      </Box>
    </Box>
  );
}
