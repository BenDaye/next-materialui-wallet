import { AccountBaseProps } from './types';
import store from 'store';

export const getAccounts = (): AccountBaseProps[] => {
  const accounts: AccountBaseProps[] = [];

  try {
    store.each((value, key) => {
      if (key.startsWith('account:')) {
        const uuid = key.replace('account:', '');
        accounts.push({ ...value, uuid });
      }
    });
  } catch (err) {
    console.error(err);
  }

  return accounts;
};

export const saveAccount = ({
  name,
  uuid,
  address,
  chain_type,
  mnemonic,
  private_key,
}: AccountBaseProps): void => {
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
  } catch (err) {
    console.error(err);
  }
};
