import { useNotice } from '@@/hook';
import { useEffect, useState } from 'react';
import useFetch from 'use-http';
import { BalanceProps } from './types';

export const useBalance = (
  chain_type: string,
  uuid: string,
  address: string
): BalanceProps => {
  const { error, get, response } = useFetch('http://168.63.250.198:1323/chain');
  const [balance, setBalance] = useState<BalanceProps>({
    address,
    balance: '',
    balance_int: '',
    decimals: '',
  });
  const { showError } = useNotice();

  useEffect(() => {
    if (!chain_type || !uuid || !address) return;
    getBalance();
  }, [chain_type, uuid, address]);

  useEffect(() => {
    error && showError((error as Error).message);
  }, [error]);

  const getBalance = async (): Promise<void> => {
    try {
      const res = await get(
        `/getBalanceByAddress?chain_type=${chain_type}&uuid=${uuid}&address=${address}`
      );

      if (!res) return;

      const { success, result } = res;

      if (response.ok && success) setBalance(result.data);
    } catch (err) {
      showError((err as Error).message);
    }
  };

  return balance;
};
