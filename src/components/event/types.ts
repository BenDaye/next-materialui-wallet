import type { Codec, TypeDef } from '@polkadot/types/types';
import { ComponentType, ReactElement } from 'react';

export interface ParamDef {
  length?: number;
  name?: string;
  type: TypeDef;
}

export interface ParamValue {
  isValid: boolean;
  value: Codec;
}

export interface ParamProps {
  name?: string;
  label?: string;
  value: ParamValue;
  options?: any;
}

export type ComponentMap = Record<string, ComponentType<ParamProps>>;

export interface TypeToComponent {
  c: ComponentType<ParamProps>;
  t: string[];
}
