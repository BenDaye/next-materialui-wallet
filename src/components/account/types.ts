export type PairType =
  | 'ecdsa'
  | 'ed25519'
  | 'ed25519-ledger'
  | 'ethereum'
  | 'sr25519';
export type SeedType = 'bip' | 'raw' | 'dev';
export type RestoreSeedType = 'bip' | 'raw' | 'keystore';
export const DEFAULT_PAIR_TYPE = 'sr25519';

export interface DeriveValidationOutput {
  error?: string;
  warning?: string;
}

export interface AddressState {
  address: string | null;
  derivePath: string;
  deriveValidation?: DeriveValidationOutput;
  isSeedValid: boolean;
  pairType: PairType;
  seed: string;
  seedType: SeedType;
}

export interface CreateAccountParamsCallback {
  derivePath: string;
  pairType: PairType;
}
