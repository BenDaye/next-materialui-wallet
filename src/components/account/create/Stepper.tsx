import React, {
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { BaseProps } from '@@/types';
import { useChain, useNotice } from '@@/hook';
import { useRouter } from 'next/router';
import { CreateAccountContext } from './context';
import {
  CreateAccountContextProps,
  CreateAccountProps,
  PairType,
  SeedType,
} from './types';
import { CreateResult, KeyringJson$Meta } from '@polkadot/ui-keyring/types';
import { CreateAccountParams } from './Params';
import { CreateAccountIntro } from './Intro';
import { createAccount, generateAccount, updateAccount } from './helper';
import { CreateAccountReminder } from './Reminder';
import { CreateAccountConfirm } from './Confirm';

interface CreateAccountStepperProps extends BaseProps {}

function Stepper({
  children,
}: CreateAccountStepperProps): ReactElement<CreateAccountStepperProps> | null {
  const router = useRouter();
  const { isChainReady, genesisHash } = useChain();
  const { showSuccess, showError } = useNotice();
  const [step, setStep] = useState<number>(1);
  const [
    { address, seed, seedType, pairType, derivePath },
    setAccountProps,
  ] = useState<CreateAccountProps>(() => generateAccount('bip', 'sr25519', ''));
  const [meta, setMeta] = useState<KeyringJson$Meta>({
    genesisHash,
    isHardware: false,
  });
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    setAccountProps(updateAccount(seed, seedType, pairType, derivePath));
  }, [seed, seedType, pairType, derivePath]);

  const value: CreateAccountContextProps = useMemo(
    () => ({
      step,
      setStep,
      address,
      seed,
      seedType,
      pairType,
      derivePath,
      setAccountProps,
      meta,
      setMeta,
      password,
      setPassword,
    }),
    [
      step,
      setStep,
      address,
      seed,
      seedType,
      pairType,
      derivePath,
      setAccountProps,
      meta,
      setMeta,
      password,
      setPassword,
    ]
  );

  if (!isChainReady) return null;

  return (
    <CreateAccountContext.Provider value={value}>
      <>
        <CreateAccountIntro />
        <CreateAccountParams />
        <CreateAccountReminder />
        <CreateAccountConfirm />
        {children}
      </>
    </CreateAccountContext.Provider>
  );
}

export const CreateAccountStepper = memo(Stepper);
