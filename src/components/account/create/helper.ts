import { isHex, u8aToHex } from '@polkadot/util';
import {
  hdLedger,
  hdValidatePath,
  keyExtractSuri,
  mnemonicGenerate,
  mnemonicValidate,
  randomAsU8a,
} from '@polkadot/util-crypto';
import type { CreateAccountProps, PairType, SeedType } from './types';
import { DEV_PHRASE } from '@polkadot/keyring/defaults';
import keyring from '@polkadot/ui-keyring';
import { CreateResult, KeyringJson$Meta } from '@polkadot/ui-keyring/types';
import { NOOP } from '@utils/emptyFunction';

export function newSeed(seedType: SeedType, initialSeed?: string): string {
  switch (seedType) {
    case 'bip':
      return mnemonicGenerate();
    case 'dev':
      return DEV_PHRASE;
    default:
      return initialSeed || u8aToHex(randomAsU8a());
  }
}

export function getSuri(
  seed: string,
  derivePath: string,
  pairType: PairType
): string {
  return pairType === 'ed25519-ledger'
    ? u8aToHex(hdLedger(seed, derivePath).secretKey.slice(0, 32))
    : pairType === 'ethereum'
    ? `${seed}/${derivePath}`
    : `${seed}${derivePath}`;
}

export function addressFromSeed(
  seed: string,
  derivePath: string,
  pairType: PairType
): string {
  return keyring.createFromUri(
    getSuri(seed, derivePath, pairType),
    {},
    pairType === 'ed25519-ledger' ? 'ed25519' : pairType
  ).address;
}

export const DEFAULT_PAIR_TYPE: PairType = 'sr25519';

export function generateAccount(
  seedType: SeedType,
  pairType: PairType = DEFAULT_PAIR_TYPE,
  derivePath: string,
  initialSeed?: string
): CreateAccountProps {
  const seed = newSeed(seedType, initialSeed);
  const address = addressFromSeed(seed, derivePath, pairType);

  return {
    address,
    seed,
    seedType,
    pairType,
    derivePath,
  };
}

export function deriveValidate(
  seed: string,
  seedType: SeedType,
  pairType: PairType,
  derivePath: string
): true | string {
  try {
    const { password, path } = keyExtractSuri(
      pairType === 'ethereum' ? `${seed}/${derivePath}` : `${seed}${derivePath}`
    );
    let result: true | string = true;

    // show a warning in case the password contains an unintended / character
    if (password?.includes('/')) {
      result = 'WARNING_SLASH_PASSWORD';
    }

    // we don't allow soft for ed25519
    if (pairType === 'ed25519' && path.some(({ isSoft }): boolean => isSoft)) {
      return 'SOFT_NOT_ALLOWED';
    }

    // we don't allow password for hex seed
    if (seedType === 'raw' && password) {
      return 'PASSWORD_IGNORED';
    }

    if (pairType === 'ethereum' && !hdValidatePath(derivePath)) {
      return 'INVALID_DERIVATION_PATH';
    }

    return result;
  } catch (error) {
    return (error as Error).message;
  }
}

export function isHexSeed(seed: string): boolean {
  return isHex(seed) && seed.length === 66;
}

export function rawValidate(seed: string): boolean {
  return (seed.length > 0 && seed.length <= 32) || isHexSeed(seed);
}

export function updateAccount(
  seed: string,
  seedType: SeedType,
  pairType: PairType,
  derivePath: string
): CreateAccountProps {
  // let address: string = '';
  // let deriveValidation: true | string = deriveValidate(
  //   seed,
  //   seedType,
  //   derivePath,
  //   pairType
  // );
  // let isSeedValid =
  //   seedType === 'raw' ? rawValidate(seed) : mnemonicValidate(seed);

  // if (deriveValidation === true && isSeedValid) {
  //   try {
  //     address = addressFromSeed(seed, derivePath, pairType);
  //   } catch (error) {
  //     console.error(error);
  //     deriveValidation: (error as Error).message || (error as Error).toString();
  //     isSeedValid = false;
  //   }
  // }

  const address: string = addressFromSeed(seed, derivePath, pairType);

  return {
    address,
    seed,
    seedType,
    pairType,
    derivePath,
  };
}

export function randomSeed(seed: string): string[] {
  return seed.split(' ').sort(() => Math.random() - 0.5);
}

export function createAccount(
  seed: string,
  pairType: PairType,
  derivePath: string,
  meta: KeyringJson$Meta,
  password: string,
  successCallback: (result: CreateResult) => void = NOOP,
  failedCallback: (error: Error) => void = NOOP
) {
  try {
    const result = keyring.addUri(
      getSuri(seed, derivePath, pairType),
      password,
      meta,
      pairType === 'ed25519-ledger' ? 'ed25519' : pairType
    );
    successCallback(result);
  } catch (error) {
    failedCallback(error);
  }
}
