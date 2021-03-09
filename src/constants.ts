import { TypeRegistry } from '@polkadot/types/create';

const registry = new TypeRegistry();

export const DEFAULT_DECIMALS = registry.createType('u32', 12);

export const DEFAULT_SS58 = registry.createType('u32', 42);

export const DEFAULT_AUX = [
  'Aux1',
  'Aux2',
  'Aux3',
  'Aux4',
  'Aux5',
  'Aux6',
  'Aux7',
  'Aux8',
  'Aux9',
];

export const MAX_HEADERS = 20;

export const MAX_EVENTS = 20;
