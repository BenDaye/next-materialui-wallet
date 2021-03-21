import type {
  CreateResult,
  KeyringJson$Meta,
} from '@polkadot/ui-keyring/types';
import { Context, createContext } from 'react';
import type { CreateAccountContextProps, CreateAccountProps } from './types';

export const CreateAccountContext: Context<CreateAccountContextProps> = createContext<CreateAccountContextProps>(
  {
    step: 1,
    setStep: (value: number) => {},
    address: '',
    seed: '',
    seedType: 'bip',
    pairType: 'sr25519',
    derivePath: '',
    setAccountProps: (value: CreateAccountProps) => {},
    meta: {},
    setMeta: (value: KeyringJson$Meta) => {},
    password: '',
    setPassword: (value: string) => {},
  }
);
