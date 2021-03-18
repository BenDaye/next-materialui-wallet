import React, {
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import type { BaseProps } from '@@/types';
import { useApi, useChain } from '@@/hook';
import { Container, Fade, Paper, Slide } from '@material-ui/core';
import {
  CreateAccountConfirm,
  CreateAccountIntro,
  CreateAccountParams,
  CreateAccountSelectMnemonicWord,
} from '.';
import {
  mnemonicGenerate,
  randomAsU8a,
  hdLedger,
  mnemonicValidate,
  hdValidatePath,
  keyExtractSuri,
} from '@polkadot/util-crypto';
import { DEV_PHRASE } from '@polkadot/keyring/defaults';
import { isHex, u8aToHex } from '@polkadot/util';
import keyring from '@polkadot/ui-keyring';
import {
  SeedType,
  PairType,
  DEFAULT_PAIR_TYPE,
  AddressState,
  CreateAccountParamsCallback,
  DeriveValidationOutput,
} from './types';
import { CreateResult, KeyringJson$Meta } from '@polkadot/ui-keyring/types';
import { NOOP } from '@components/balance/util';
import { useRouter } from 'next/router';
import { useError } from '@@/hook';
import { useSnackbar } from 'notistack';
import { useNotice } from '@@/hook';

interface CreateAccountStepperProps extends BaseProps {
  seed?: string;
  type?: PairType;
}

function newSeed(seed: string | undefined | null, seedType: SeedType): string {
  switch (seedType) {
    case 'bip':
      return mnemonicGenerate();
    case 'dev':
      return DEV_PHRASE;
    default:
      return seed || u8aToHex(randomAsU8a());
  }
}

function getSuri(seed: string, derivePath: string, pairType: PairType): string {
  return pairType === 'ed25519-ledger'
    ? u8aToHex(hdLedger(seed, derivePath).secretKey.slice(0, 32))
    : pairType === 'ethereum'
    ? `${seed}/${derivePath}`
    : `${seed}${derivePath}`;
}

function addressFromSeed(
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

function generateSeed(
  _seed: string | undefined | null,
  derivePath: string,
  seedType: SeedType,
  pairType: PairType = DEFAULT_PAIR_TYPE
): AddressState {
  const seed = newSeed(_seed, seedType);
  const address = addressFromSeed(seed, derivePath, pairType);

  return {
    address,
    derivePath,
    deriveValidation: undefined,
    isSeedValid: true,
    pairType,
    seed,
    seedType,
  };
}

function isHexSeed(seed: string): boolean {
  return isHex(seed) && seed.length === 66;
}

function rawValidate(seed: string): boolean {
  return (seed.length > 0 && seed.length <= 32) || isHexSeed(seed);
}

function deriveValidate(
  seed: string,
  seedType: SeedType,
  derivePath: string,
  pairType: PairType
): DeriveValidationOutput {
  try {
    const { password, path } = keyExtractSuri(
      pairType === 'ethereum' ? `${seed}/${derivePath}` : `${seed}${derivePath}`
    );
    let result: DeriveValidationOutput = {};

    // show a warning in case the password contains an unintended / character
    if (password?.includes('/')) {
      result = { warning: 'WARNING_SLASH_PASSWORD' };
    }

    // we don't allow soft for ed25519
    if (pairType === 'ed25519' && path.some(({ isSoft }): boolean => isSoft)) {
      return { ...result, error: 'SOFT_NOT_ALLOWED' };
    }

    // we don't allow password for hex seed
    if (seedType === 'raw' && password) {
      return { ...result, error: 'PASSWORD_IGNORED' };
    }

    if (pairType === 'ethereum' && !hdValidatePath(derivePath)) {
      return { ...result, error: 'INVALID_DERIVATION_PATH' };
    }

    return result;
  } catch (error) {
    return { error: (error as Error).message };
  }
}

function updateAddress(
  seed: string,
  derivePath: string,
  seedType: SeedType,
  pairType: PairType
): AddressState {
  let address: string | null = null;
  let deriveValidation: DeriveValidationOutput = deriveValidate(
    seed,
    seedType,
    derivePath,
    pairType
  );
  let isSeedValid =
    seedType === 'raw' ? rawValidate(seed) : mnemonicValidate(seed);

  if (!deriveValidation?.error && isSeedValid) {
    try {
      address = addressFromSeed(seed, derivePath, pairType);
    } catch (error) {
      console.error(error);
      deriveValidation = {
        error: (error as Error).message
          ? (error as Error).message
          : (error as Error).toString(),
      };
      isSeedValid = false;
    }
  }

  return {
    address,
    derivePath,
    deriveValidation,
    isSeedValid,
    pairType,
    seed,
    seedType,
  };
}

function createAccount(
  address: AddressState,
  password: string,
  meta: KeyringJson$Meta,
  successCb: (result: CreateResult) => void = NOOP,
  failedCb: (error: Error) => void = NOOP
) {
  try {
    const result = keyring.addUri(
      getSuri(address.seed, address.derivePath, address.pairType),
      password,
      meta,
      address.pairType === 'ed25519-ledger' ? 'ed25519' : address.pairType
    );
    successCb(result);
  } catch (error) {
    failedCb(error);
  }
}

function CreateAccountStepper({
  children,
  seed: propsSeed,
  type: propsType,
}: CreateAccountStepperProps): ReactElement<CreateAccountStepperProps> {
  const router = useRouter();
  const { genesisHash } = useChain();
  const { setError } = useError();
  const { showSuccess } = useNotice();
  const [step, setStep] = useState<number>(1);
  const [showScreenShootAlert, setShowScreenShootAlert] = useState<boolean>(
    true
  );
  const [address, setAddress] = useState<AddressState>(() =>
    generateSeed(propsSeed, '', propsSeed ? 'raw' : 'bip', propsType)
  );

  const onChangeParams = useCallback(
    ({
      derivePath: newDerivePath,
      pairType: newPairType,
    }: CreateAccountParamsCallback) => {
      const { seed, derivePath, pairType, seedType } = address;
      if (derivePath === newDerivePath && pairType === newDerivePath) return;
      setAddress(updateAddress(seed, newDerivePath, seedType, newPairType));
    },
    [address]
  );

  const onSuccess = useCallback(
    (result: CreateResult) => {
      showSuccess(`账户[${result.json.meta?.name}]创建成功`);
      router.push('/wallet');
    },
    [router]
  );

  const onFailed = useCallback(setError, [setError]);

  const onConfirm = useCallback(
    ({ name, password }) => {
      const meta: KeyringJson$Meta = {
        name: name.trim(),
        isHardware: false,
        genesisHash,
      };
      createAccount(address, password, meta, onSuccess, onFailed);
    },
    [address]
  );

  const onChangeStep = useCallback(setStep, [step]);

  return (
    <>
      {step === 1 && (
        <Fade in={step === 1}>
          <Container>
            <CreateAccountIntro onChangeStep={onChangeStep} />
          </Container>
        </Fade>
      )}
      {step === 2 && (
        <Fade in={step === 2}>
          <Container>
            <CreateAccountParams
              alert={{ showScreenShootAlert, setShowScreenShootAlert }}
              params={address}
              onChange={onChangeParams}
              onChangeStep={onChangeStep}
            />
          </Container>
        </Fade>
      )}
      {step === 3 && (
        <Fade in={step === 3}>
          <Container>
            <CreateAccountSelectMnemonicWord
              params={address}
              onChangeStep={onChangeStep}
            />
          </Container>
        </Fade>
      )}
      {step === 4 && (
        <Fade in={step === 4}>
          <Container>
            <CreateAccountConfirm
              params={address}
              onConfirm={onConfirm}
              onChangeStep={onChangeStep}
            />
          </Container>
        </Fade>
      )}
    </>
  );
}

export default memo(CreateAccountStepper);
