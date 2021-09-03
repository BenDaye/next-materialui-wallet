import { Context, createContext } from 'react';
import type { CreateAccountContextProps } from './types';

export const CreateAccountContext: Context<CreateAccountContextProps> =
  createContext<CreateAccountContextProps>({
    step: 1,
    setStep: (value: number) => {},
    chain_type: '',
    mnemonic: '',
  });
