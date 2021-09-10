import {
  AccountBaseProps,
  CallbackParams,
  GetAccountParams,
  SaveAccountParams,
} from './types';
import store from 'store';
import { NOOP } from '@utils/emptyFunction';

export const getAccounts = ({
  onSuccess = NOOP,
  onError = NOOP,
}: CallbackParams): AccountBaseProps[] => {
  const accounts: AccountBaseProps[] = [];

  try {
    store.each((value, key) => {
      if (key.startsWith('account:')) {
        const uuid = key.replace('account:', '');
        accounts.push({ ...value, uuid });
      }
    });
    onSuccess(accounts);
  } catch (err) {
    onError(err);
  }

  return accounts;
};

export const getAccount = ({
  name,
  uuid,
  address,
  onSuccess = NOOP,
  onError = NOOP,
}: GetAccountParams): AccountBaseProps | undefined => {
  if (!name && !uuid && !address) return;
  let account;

  try {
    if (uuid) {
      account = store.get(`account:${uuid}`);
    } else if (name) {
      account = getAccounts({}).find((a) => a.name === name);
    } else {
      account = getAccounts({}).find((a) => a.address === address);
    }
    onSuccess(account);
    return account;
  } catch (err) {
    onError(err);
  }
};

export const saveAccount = ({
  name,
  uuid,
  address,
  chain_type,
  mnemonic,
  private_key,
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
      mnemonic,
      private_key,
    });
    onSuccess();
  } catch (err) {
    onError(err);
  }
};

export const deleteAccount = ({
  name,
  uuid,
  address,
  onSuccess = NOOP,
  onError = NOOP,
}: GetAccountParams): void => {
  if (!name && !uuid && !address) return;

  try {
    if (uuid) {
      store.remove(`account:${uuid}`);
    } else if (name) {
      const _uuid = getAccounts({}).find((a) => a.name === name)?.uuid;
      if (_uuid) store.remove(`account:${_uuid}`);
    } else {
      const _uuid = getAccounts({}).find((a) => a.address === address)?.uuid;
      if (_uuid) store.remove(`account:${_uuid}`);
    }
    onSuccess();
  } catch (err) {
    onError(err);
  }
};
