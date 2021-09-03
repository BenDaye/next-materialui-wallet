import { useIsMountedRef, useNotice } from '@@/hook';
import { useCallback, useContext, useEffect, useState } from 'react';
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
  GetAddressParams,
  ImportAccountParams,
  ImportAccountResult,
} from './types';
import store from 'store';

export const useAccounts = (): AccountContextProps =>
  useContext<AccountContextProps>(AccountContext);

export const useAccount = (uuid: string): AccountProps => {
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [chain_type, setChainType] = useState<string>('');
  const [mnemonic, setMnemonic] = useState<string>('');
  const [private_key, setPrivateKey] = useState<string>('');
  const mountedRef = useIsMountedRef();

  useEffect(() => {
    const account = store.get(uuid);
    if (!account) return;
  }, [mountedRef, uuid]);

  const onExport = useCallback(
    (params: ExportAccountParams) => {
      return exportAccount(params);
    },
    [uuid]
  );

  const onDelete = useCallback(
    (params: DeleteAccountParams) => {
      return deleteAccount(params);
    },
    [uuid]
  );

  const onChangeName = useCallback(
    (params: ChangeNameParams) => {
      return changeName(params);
    },
    [uuid]
  );

  const onChangePassword = useCallback(
    (params: ChangePasswordParams) => {
      return changePassword(params);
    },
    [uuid]
  );

  return {
    name,
    address,
    chain_type,
    uuid,
    mnemonic,
    private_key,
    onExport,
    onDelete,
    onChangeName,
    onChangePassword,
  };
};

export const getMnemonic = (): string => {
  const { error, get, response } = useFetch('http://168.63.250.198:1323/chain');
  const [account, setAccount] = useState<string>('');
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
      const res = await get(`/getMnemonic`);

      if (!res) return;

      const { status, data } = res;

      if (response.ok && status === 1) setAccount(data.mnemonic);
    } catch (err) {
      showError((err as Error).message);
    }
  };

  return account;
};

export const getAddressByMnemonic = ({
  value,
  chain_type,
}: GetAddressParams): string => {
  const { error, get, response } = useFetch('http://168.63.250.198:1323/chain');
  const [account, setAccount] = useState<string>('');
  const mountedRef = useIsMountedRef();
  const { showError } = useNotice();

  useEffect(() => {
    error && showError((error as Error).message);
  }, [error]);

  useEffect(() => {
    if (!value || !chain_type) return;
    action();
  }, [mountedRef, value, chain_type]);

  const action = async (): Promise<void> => {
    try {
      const res = await get(
        `/mnemonicToAddress?mnemonic=${value}&chain_type=${chain_type}`
      );

      if (!res) return;

      const { status, data } = res;

      if (response.ok && status === 1) setAccount(data.address);
    } catch (err) {
      showError((err as Error).message);
    }
  };

  return account;
};

export const getAddressByPrivateKey = ({
  value,
  chain_type,
}: GetAddressParams): string => {
  const { error, get, response } = useFetch('http://168.63.250.198:1323/chain');
  const [account, setAccount] = useState<string>('');
  const mountedRef = useIsMountedRef();
  const { showError } = useNotice();

  useEffect(() => {
    error && showError((error as Error).message);
  }, [error]);

  useEffect(() => {
    if (!value || !chain_type) return;
    action();
  }, [mountedRef, value, chain_type]);

  const action = async (): Promise<void> => {
    try {
      const res = await get(
        `/privateToAddress?private_key=${value}&chain_type=${chain_type}`
      );

      if (!res) return;

      const { status, data } = res;

      if (response.ok && status === 1) setAccount(data.address);
    } catch (err) {
      showError((err as Error).message);
    }
  };

  return account;
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
  const { error, get, response } = useFetch('http://168.63.250.198:1323/chain');
  const [account, setAccount] = useState<ExportAccountResult>({
    mnemonic: '',
    private_key: '',
  });

  const { showError } = useNotice();

  useEffect(() => {
    if (!chain_type || !export_type || !password || !uuid) return;
    action();
  }, [chain_type, uuid, password, chain_type]);

  useEffect(() => {
    error && showError((error as Error).message);
  }, [error]);

  const action = async (): Promise<void> => {
    try {
      const res = await get(
        `/exportAccount?exportType=${export_type}&password=${password}&chain_type=${chain_type}&uuid=${uuid}`
      );

      if (!res) return;

      const { status, data } = res;

      if (response.ok && status === 1) setAccount(data);
    } catch (err) {
      showError((err as Error).message);
    }
  };

  return account;
};

export const deleteAccount = ({
  uuid,
  password,
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

export const changeName = ({ name, uuid }: ChangeNameParams): void => {
  const { error, post, response } = useFetch(
    'http://168.63.250.198:1323/chain'
  );
  const [account, setAccount] = useState();
  const { showError } = useNotice();
  const mountedRef = useIsMountedRef();

  useEffect(() => {
    error && showError((error as Error).message);
  }, [error]);

  useEffect(() => {
    action();
  }, [mountedRef]);

  const action = async (): Promise<void> => {
    try {
      const res = await post(`/changeName`, { uuid, name });

      if (!res) return;

      const { status, data } = res;

      if (response.ok && status === 1) setAccount(data);
    } catch (err) {
      showError((err as Error).message);
    }
  };
};

export const changePassword = ({
  password,
  new_password,
  uuid,
}: ChangePasswordParams): void => {
  const { error, post, response } = useFetch(
    'http://168.63.250.198:1323/chain'
  );
  const [account, setAccount] = useState();
  const { showError } = useNotice();
  const mountedRef = useIsMountedRef();

  useEffect(() => {
    error && showError((error as Error).message);
  }, [error]);

  useEffect(() => {
    action();
  }, [mountedRef]);

  const action = async (): Promise<void> => {
    try {
      const res = await post(`/changePassword`, {
        uuid,
        password,
        new_password,
      });

      if (!res) return;

      const { status, data } = res;

      if (response.ok && status === 1) setAccount(data);
    } catch (err) {
      showError((err as Error).message);
    }
  };
};
