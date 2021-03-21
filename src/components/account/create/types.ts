import { CreateResult, KeyringJson$Meta } from '@polkadot/ui-keyring/types';
import { Dispatch, SetStateAction } from 'react';

export type PairType =
  | 'ecdsa'
  | 'ed25519'
  | 'ed25519-ledger'
  | 'ethereum'
  | 'sr25519';
export type SeedType = 'bip' | 'raw' | 'dev';

export interface CreateAccountProps {
  address: string;
  seed: string;
  seedType: SeedType;
  pairType: PairType;
  derivePath: string;
}

export interface CreateAccountContextProps extends CreateAccountProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  setAccountProps: Dispatch<SetStateAction<CreateAccountProps>>;
  meta: KeyringJson$Meta;
  setMeta: Dispatch<SetStateAction<KeyringJson$Meta>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
}
