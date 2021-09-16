import { useIsMountedRef } from '@@/hook';
import { useContext, useEffect, useMemo, useState } from 'react';
import useFetch from 'use-http';
import { AccountContext } from './context';
import {
  AccountContextProps,
  AccountProps,
  GetAccountParams,
  GetAddressByMnemonic,
  GetAddressByPrivateKey,
} from './types';
import { getAccount } from './helper';

export const useAccounts = (): AccountContextProps =>
  useContext<AccountContextProps>(AccountContext);

export const useAccount = ({
  uuid,
  name,
  address,
}: GetAccountParams): AccountProps | undefined => {
  const { accounts } = useAccounts();
  const [account, setAccount] = useState<AccountProps | undefined>(() =>
    getAccount({ uuid, name, address })
  );

  useEffect(() => {
    setAccount(getAccount({ uuid, name, address }));
  }, [uuid, name, address, accounts]);

  return account;
};

export const useCurrentAccount = (
  accounts: AccountProps[]
): AccountProps | undefined => {
  const account = useMemo(() => accounts.find((a) => a.activated), [accounts]);
  return account;
};

export const useAccountsByType = (accounts: AccountProps[], type: string) =>
  accounts.filter((a) => a.chain_type === type);

export const useMnemonic = (): string | undefined => {
  const { error, loading, data } = useFetch(
    '/chain/getMnemonic',
    undefined,
    []
  );

  if (error || loading) return;
  return data.data.mnemonic;
};

export const useAddressByMnemonic = ({
  value,
  chain_type,
}: GetAddressByMnemonic): string | undefined => {
  const { error, loading, data } = useFetch(
    `/chain/mnemonicToAddress?mnemonic=${value}&chain_type=${chain_type}`
  );

  if (error || loading) return;
  return data.data.address;
};

export const useAddressByPrivateKey = ({
  value,
  chain_type,
}: GetAddressByPrivateKey): string | undefined => {
  const { error, loading, data } = useFetch(
    `/chain/privateToAddress?private_key=${value}&chain_type=${chain_type}`,
    undefined,
    []
  );
  if (error || loading) return;
  return data?.address;
};
