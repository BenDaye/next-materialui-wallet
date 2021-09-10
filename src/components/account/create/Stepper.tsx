import React, { memo, ReactElement, useMemo, useState } from 'react';
import type { BaseProps } from '@@/types';
import { CreateAccountContext } from './context';
import { CreateAccountContextProps } from './types';
import { CreateAccountParams } from './Params';
import { CreateAccountIntro } from './Intro';
import { CreateAccountReminder } from './Reminder';
import { CreateAccountConfirm } from './Confirm';
import { getMnemonic } from '@components/php/account/hook';
import { useRouter } from 'next/router';

interface CreateAccountStepperProps extends BaseProps {}

function Stepper({
  children,
}: CreateAccountStepperProps): ReactElement<CreateAccountStepperProps> | null {
  const [step, setStep] = useState<number>(1);
  const router = useRouter();
  const { chain } = router.query;
  const mnemonic = getMnemonic();
  const chain_type = useMemo((): string => chain?.toString() || '', [chain]);

  const value: CreateAccountContextProps = useMemo(
    () => ({
      step,
      setStep,
      chain_type,
      mnemonic,
    }),
    [step, setStep, chain_type, mnemonic]
  );

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
