import { useIsMountedRef, useNotice } from '@@/hook';
import { useEffect, useState } from 'react';
import useFetch from 'use-http';
import { Chain } from './types';

export const getChainTypes = (): Chain[] => {
  const { error, get, response } = useFetch('http://168.63.250.198:1323/chain');
  const [chains, setChains] = useState<Chain[]>([]);
  const mountedRef = useIsMountedRef();
  const { showError } = useNotice();

  useEffect(() => {
    error && showError((error as Error).message);
  }, [error]);

  useEffect(() => {
    action();
  }, [mountedRef]);

  const action = async (): Promise<void> => {
    try {
      const res = await get(`/getChainType`);

      if (!res) return;

      const { status, data } = res;

      if (response.ok && status === 1) setChains(data);
    } catch (err) {
      showError((err as Error).message);
    }
  };

  return chains;
};
