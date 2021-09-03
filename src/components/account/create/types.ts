import { StringifyOptions } from 'query-string';
import { Dispatch, SetStateAction } from 'react';
export interface CreateAccountProps {
  chain_type: string;
  mnemonic: string;
}

export interface CreateAccountContextProps extends CreateAccountProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}
