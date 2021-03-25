import type { Codec, TypeDef } from '@polkadot/types/types';

export interface Param {
  name: string;
  type: TypeDef;
}

export interface ParamDef {
  length?: number;
  name?: string;
  type: TypeDef;
}

export interface Value {
  isValid: boolean;
  value: Codec;
}

export interface Extracted {
  hash: string | null;
  params: Param[];
  signature: string | null;
  signatureType: string | null;
  values: Value[];
}
