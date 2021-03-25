import { useAccount, useChain, useSetting } from '@@/hook';
import { Box, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '@styles/Layout.module.css';
import { NodeIcon } from '@components/setting/components/NodeIcon';

export default function Home() {
  const router = useRouter();
  const { hasAccount } = useAccount();
  const { isChainReady } = useChain();
  const { node } = useSetting();

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
          <Typography variant="h1">
            <NodeIcon name={node.name} fontSize="inherit" />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
