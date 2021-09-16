import { AccountProps, GetAccountParams, SaveAccountParams } from './types';
import store from 'store';
import { NOOP } from '@utils/emptyFunction';
import { CallbackParams } from '../types';

export const getAccounts = ({
  onSuccess = NOOP,
  onError = NOOP,
}: CallbackParams): AccountProps[] => {
  const accounts: AccountProps[] = [];

  try {
    store.each((value, key) => {
      if (key.startsWith('account:')) accounts.push(value);
    });
    onSuccess(accounts);
  } catch (err) {
    onError(err);
  }

  return accounts;
};

export const getUuid = ({
  uuid,
  name,
  address,
}: GetAccountParams): string | undefined => {
  if (!uuid && !name && !address) return;
  return (
    uuid ||
    getAccounts({}).find((a) => a.name === name)?.uuid ||
    getAccounts({}).find((a) => a.address === address)?.uuid
  );
};

export const getAccount = ({
  name,
  uuid,
  address,
  onSuccess = NOOP,
  onError = NOOP,
}: GetAccountParams): AccountProps | undefined => {
  const _uuid = getUuid({ uuid, name, address });

  try {
    if (_uuid) {
      const info = store.get(`account:${_uuid}`);
      onSuccess(info);
      return info;
    }
  } catch (err) {
    onError(err);
  }
};

export const saveAccount = ({
  name,
  uuid,
  address,
  chain_type,
  activated,
  onSuccess = NOOP,
  onError = NOOP,
}: SaveAccountParams): void => {
  if (!name || !uuid) return;

  try {
    store.set(`account:${uuid}`, {
      name,
      uuid,
      address,
      chain_type,
      activated,
    });
    onSuccess();
  } catch (err) {
    onError(err);
  }
};

export const deleteAccount = ({
  uuid,
  name,
  address,
  onSuccess = NOOP,
  onError = NOOP,
}: GetAccountParams): void => {
  const _uuid = getUuid({ uuid, name, address });

  try {
    if (!_uuid) return;
    store.remove(`account:${_uuid}`);
    onSuccess();
  } catch (err) {
    onError(err);
  }
};

export const activateAccount = ({
  name,
  uuid,
  address,
  onSuccess = NOOP,
  onError = NOOP,
}: GetAccountParams): void => {
  const _uuid = getUuid({ uuid, name, address });

  try {
    if (!_uuid) return;
    store.each((value, key) => {
      if (key.startsWith(`account:${_uuid}`)) {
        saveAccount({ ...value, activated: true });
      } else {
        saveAccount({ ...value, activated: false });
      }
    });
    onSuccess();
  } catch (err) {
    onError(err);
  }
};
