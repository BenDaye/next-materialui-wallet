import { useIsMountedRef, useNotice } from '@@/hook';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useFetch from 'use-http';
import { AccountContext } from './context';
import {
  AccountBaseProps,
  AccountContextProps,
  AccountProps,
  ChangeNameParams,
  ChangePasswordParams,
  DeleteAccountParams,
  DeleteAccountResult,
  ExportAccountParams,
  ExportAccountResult,
  GetAccountParams,
  GetAddressParams,
  ImportAccountParams,
  ImportAccountResult,
} from './types';
import store from 'store';
import { NOOP } from '@utils/emptyFunction';
import { getAccount } from './helper';

export const useAccounts = (): AccountContextProps =>
  useContext<AccountContextProps>(AccountContext);

export const useAccount = ({
  uuid,
  name,
  address,
}: GetAccountParams): AccountProps | undefined => {
  const [account, setAccount] = useState<AccountBaseProps | undefined>(() =>
    getAccount({ uuid, name, address })
  );
  const mountedRef = useIsMountedRef();

  useEffect(() => {
    setAccount(getAccount({ uuid, name, address }));
  }, [mountedRef, uuid, name, address]);

  const onExport = useCallback(
    (params: ExportAccountParams) => {
      return exportAccount(params);
    },
    [account]
  );

  const onDelete = useCallback(
    (params: DeleteAccountParams) => {
      return deleteAccount(params);
    },
    [account]
  );

  const onChangeName = useCallback(
    (params: ChangeNameParams) => {
      return changeName(params);
    },
    [account]
  );

  const onChangePassword = useCallback(
    (params: ChangePasswordParams) => {
      return changePassword(params);
    },
    [account]
  );

  if (account) {
    return {
      ...account,
      onExport,
      onDelete,
      onChangeName,
      onChangePassword,
    };
  }
};

export const getMnemonic = (): string | undefined => {
  const { error, loading, data } = useFetch(
    '/chain/getMnemonic',
    undefined,
    []
  );

  if (error || loading) return;
  return data.data.mnemonic;
};

export const getAddressByMnemonic = ({
  value,
  chain_type,
}: GetAddressParams): string | undefined => {
  const { error, loading, data } = useFetch(
    `/chain/mnemonicToAddress?mnemonic=${value}&chain_type=${chain_type}`
  );

  if (error || loading) return;
  return data.data.address;
};

export const getAddressByPrivateKey = ({
  value,
  chain_type,
}: GetAddressParams): string | undefined => {
  const { error, loading, data } = useFetch(
    `/chain/privateToAddress?private_key=${value}&chain_type=${chain_type}`,
    undefined,
    []
  );
  if (error || loading) return;
  return data?.address;
};

export const importAccount = ({
  name,
  password,
  mnemonic,
  private_key,
  chain_type,
}: ImportAccountParams): ImportAccountResult => {
  const { error, post, response } = useFetch(
    'http://168.63.250.198:1323/chain'
  );
  const [account, setAccount] = useState<ImportAccountResult>({
    uuid: '',
    name: '',
    address: '',
  });

  const { showError } = useNotice();

  useEffect(() => {
    if (!chain_type || !name || !password) return;
    if (!mnemonic && !private_key) return;
    action();
  }, [chain_type, name, password, mnemonic, private_key, chain_type]);

  useEffect(() => {
    error && showError((error as Error).message);
  }, [error]);

  const action = async (): Promise<void> => {
    try {
      const res = await post(`/importAccount`, {
        name,
        password,
        mnemonic,
        private_key,
        chain_type,
      });

      if (!res) return;

      const { status, data } = res;

      if (response.ok && status === 1) setAccount(data);
    } catch (err) {
      showError((err as Error).message);
    }
  };

  return account;
};

export const exportAccount = ({
  export_type,
  password,
  chain_type,
  uuid,
}: ExportAccountParams): ExportAccountResult => {
  const { error, loading, data } = useFetch(
    `/chain/exportAccount?exportType=${export_type}&password=${password}&chain_type=${chain_type}&uuid=${uuid}`,
    undefined,
    []
  );
  if (error || loading) return { mnemonic: '', private_key: '' };
  return data;
};

export const deleteAccount = ({
  uuid,
  password,
  onSuccess = NOOP,
  onError = NOOP,
}: DeleteAccountParams): DeleteAccountResult => {
  const { error, post, response } = useFetch(
    'http://168.63.250.198:1323/chain'
  );
  const [account, setAccount] = useState<DeleteAccountResult>({});
  const { showError } = useNotice();

  useEffect(() => {
    if (!password || !uuid) return;
    action();
  }, [uuid, password]);

  useEffect(() => {
    error && showError((error as Error).message);
  }, [error]);

  const action = async (): Promise<void> => {
    try {
      const res = await post(`/deleteAccount`, { uuid, password });

      if (!res) return;

      const { status, data } = res;

      if (response.ok && status === 1) setAccount(data);
    } catch (err) {
      showError((err as Error).message);
    }
  };

  return account;
};

export const changeName = ({
  name,
  uuid,
  onSuccess = NOOP,
  onError = NOOP,
}: ChangeNameParams): void => {
  const { error } = useFetch(
    '/chain/changeName',
    {
      method: 'post',
      data: { name, uuid },
    },
    []
  );
  if (error) onError(error);
  onSuccess();
};

export const useAccountName = ({
  name,
  uuid,
  onSuccess = NOOP,
  onError = NOOP,
}: ChangeNameParams): void => {
  const { post, abort, response } = useFetch('/chain/changeName');

  useEffect(() => {
    const request = async () => {
      const { status } = await post('', { name, uuid });
      if (!response.ok) return;
      if (status === 1) onSuccess(uuid, name);
    };

    request();
    return () => {
      abort();
    };
  }, [name, uuid]);
};

export const changePassword = ({
  password,
  new_password,
  uuid,
  onSuccess = NOOP,
  onError = NOOP,
}: ChangePasswordParams): void => {
  const { error } = useFetch(
    '/chain/changePassword',
    {
      method: 'post',
      data: { password, new_password, uuid },
    },
    []
  );
  if (error) onError(error);
  onSuccess();
};
