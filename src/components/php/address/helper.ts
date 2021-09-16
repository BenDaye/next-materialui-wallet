import { NOOP } from '@utils/emptyFunction';
import { CallbackParams } from '../types';
import {
  AddressProps,
  DeleteAddressParams,
  GetAddressParams,
  SaveAddressParams,
} from './types';
import store from 'store';

export const getAddresses = ({
  onSuccess = NOOP,
  onError = NOOP,
}: CallbackParams): AddressProps[] => {
  const addresses: AddressProps[] = [];

  try {
    store.each((value, key) => {
      if (key.startsWith('address:')) addresses.push(value);
    });
    onSuccess(addresses);
  } catch (err) {
    onError(err);
  }

  return addresses;
};

export const getUuid = ({
  uuid,
  name,
  address,
}: GetAddressParams): string | undefined => {
  if (!uuid && !name && !address) return;
  return (
    uuid ||
    getAddresses({}).find((a) => a.name === name)?.uuid ||
    getAddresses({}).find((a) => a.address === address)?.uuid
  );
};

export const getAddress = ({
  uuid,
  name,
  address,
  onSuccess = NOOP,
  onError = NOOP,
}: GetAddressParams): AddressProps | undefined => {
  const _uuid = getUuid({ uuid, name, address });

  try {
    if (_uuid) {
      const info = store.get(`address:${_uuid}`);
      onSuccess(info);
      return info;
    }
  } catch (err) {
    onError(err);
  }
};

export const saveAddress = ({
  uuid,
  name,
  address,
  chain_type,
  activated,
  onSuccess = NOOP,
  onError = NOOP,
}: SaveAddressParams): void => {
  if (!uuid || !name || !address) return;

  try {
    store.set(`address:${uuid}`, {
      uuid,
      name,
      address,
      chain_type,
      activated,
    });
    onSuccess();
  } catch (err) {
    onError(err);
  }
};

export const deleteAddress = ({
  uuid,
  name,
  address,
  onSuccess = NOOP,
  onError = NOOP,
}: DeleteAddressParams): void => {
  const _uuid = getUuid({ uuid, name, address });

  try {
    if (!_uuid) return;
    store.remove(`address:${_uuid}`);
    onSuccess();
  } catch (err) {
    onError(err);
  }
};

export const activateAddress = ({
  name,
  uuid,
  address,
  onSuccess = NOOP,
  onError = NOOP,
}: GetAddressParams): void => {
  const _uuid = getUuid({ uuid, name, address });

  try {
    if (!_uuid) return;
    store.each((value, key) => {
      if (key.startsWith(`account:${_uuid}`)) {
        saveAddress({ ...value, activated: true });
      } else {
        saveAddress({ ...value, activated: false });
      }
    });
    onSuccess();
  } catch (err) {
    onError(err);
  }
};
