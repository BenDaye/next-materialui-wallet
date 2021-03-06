import { useAccounts, useIsMountedRef } from '@components/polkadot/hook';
import { Box } from '@material-ui/core';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import keyring from '@polkadot/ui-keyring';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const { hasAccount } = useAccounts();
  const [loading, setLoading] = useState<boolean>(true);

  const isKeyringLoaded: () => boolean = useCallback(() => {
    try {
      return !!keyring.keyring;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    }).then((v) => setLoading(false));
  }, []);

  useEffect(() => {
    const logo: HTMLElement = document.getElementById('logo') as HTMLElement;
    if (logo && !loading) {
      logo.classList.remove('animate__pulse', 'animate__infinite');
      logo.classList.add('animate__fadeOutUp');

      logo.addEventListener('animationend', redirect);
    }
    return () => {
      logo && logo.removeEventListener('animationend', redirect);
    };
  }, [loading, hasAccount]);

  function redirect() {
    if (isKeyringLoaded() && hasAccount) {
      router.replace('/wallet');
    } else {
      router.replace('/explorer');
    }
  }

  return (
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
  );
}
