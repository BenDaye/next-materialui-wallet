import { KeyringPair } from '@polkadot/keyring/types';
import keyring from '@polkadot/ui-keyring';
import { NOOP } from '@utils/emptyFunction';
import { rawValidate as validRaw } from '../create/helper';

import { mnemonicValidate as validBip } from '@polkadot/util-crypto';
import type { RestoreSeedType } from './types';
import { deriveValidate as validDp } from '../create/helper';
import type { PairType, SeedType } from '../create/types';

export { getSuri } from '../create/helper';

export const createFromJson = async (
  value: string,
  successCallback: (result: KeyringPair) => void = NOOP,
  failedCallback: (err: Error) => void = NOOP
): Promise<void> => {
  await new Promise((resolve, reject) => {
    try {
      const result = keyring.createFromJson(JSON.parse(value));
      successCallback(result);

      return resolve(result);
    } catch (err) {
      failedCallback(err);

      return reject(err);
    }
  });
};

export const rawValidate = (value: string): true | string => {
  if (!value) return 'raw_required';
  return validRaw(value) || '无效的私钥种子';
};

export const bipValidate = (value: string): true | string => {
  if (!value) return 'bip_required';
  return validBip(value) || '无效的助记词';
};

export const seedValidate = (
  value: string,
  type: RestoreSeedType
): true | string => {
  if (!value) return 'seed_required';
  switch (type) {
    case 'bip':
      return bipValidate(value);
    case 'raw':
      return rawValidate(value);
    default:
      return 'unexpected_error';
  }
};

export const deriveValidate = (
  seed: string,
  type: RestoreSeedType,
  pairType: PairType,
  derivePath: string
): true | string => {
  if (!(type === 'bip' || type === 'raw')) {
    return 'unexpected_error';
  }

  return validDp(seed, type, pairType, derivePath);
};
