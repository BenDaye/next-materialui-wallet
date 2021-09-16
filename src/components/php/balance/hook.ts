import { useEffect, useState } from 'react';
import useFetch from 'use-http';
import { BalanceProps, GetBalanceParams } from './types';

export const useBalance = ({
  chain_type,
  uuid,
  address,
}: GetBalanceParams): BalanceProps => {
  const [balance, setBalance] = useState<BalanceProps>({
    address,
    balance: '',
    balance_int: '',
    decimals: '',
  });

  const { get, response } = useFetch(
    `/chain/getBalanceByAddress?chain_type=${chain_type}&uuid=${uuid}&address=${address}`
  );

  useEffect(() => {
    const getData = async () => {
      const { status, data } = await get();
      if (!response.ok) return;
      if (status === 1) setBalance(data);
    };
    if (uuid && address && chain_type) {
      getData();
    }
  }, [chain_type, uuid, address]);

  return balance;
};
