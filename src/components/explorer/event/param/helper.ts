import type { Codec, TypeDef } from '@polkadot/types/types';
import { TypeDefInfo } from '@polkadot/types/types';
import { ComponentType, ReactElement } from 'react';
import type { ComponentMap, ParamProps, TypeToComponent } from '../types';

import Account from './Account';
import Balance from './Balance';
import Unknown from './Unknown';

const SPECIAL_TYPES = ['AccountId', 'AccountIndex', 'Address', 'Balance'];

const componentDef: TypeToComponent[] = [
  { c: Account, t: ['AccountId', 'Address', 'LookupSource'] },
  // { c: Amount, t: ['AccountIndex', 'i8', 'i16', 'i32', 'i64', 'i128', 'u8', 'u16', 'u32', 'u64', 'u128', 'u256'] },
  { c: Balance, t: ['Amount', 'Balance', 'BalanceOf'] },
  // { c: Bool, t: ['bool'] },
  // { c: Bytes, t: ['Bytes'] },
  // { c: Call, t: ['Call', 'Proposal'] },
  // { c: Code, t: ['Code'] },
  // { c: DispatchError, t: ['DispatchError'] },
  // { c: Raw, t: ['Raw', 'Keys'] },
  // { c: Enum, t: ['Enum'] },
  // { c: Hash256, t: ['Hash', 'H256'] },
  // { c: Hash160, t: ['H160'] },
  // { c: Hash512, t: ['H512'] },
  // { c: KeyValue, t: ['KeyValue'] },
  // { c: KeyValueArray, t: ['Vec<KeyValue>'] },
  // { c: Moment, t: ['Moment', 'MomentOf'] },
  // { c: Null, t: ['Null'] },
  // { c: OpaqueCall, t: ['OpaqueCall'] },
  // { c: Option, t: ['Option'] },
  // { c: Text, t: ['String', 'Text'] },
  // { c: Struct, t: ['Struct'] },
  // { c: Tuple, t: ['Tuple'] },
  // { c: Vector, t: ['Vec'] },
  // { c: VectorFixed, t: ['VecFixed'] },
  // { c: Vote, t: ['Vote'] },
  // { c: VoteThreshold, t: ['VoteThreshold'] },
  { c: Unknown, t: ['Unknown'] },
];

const components: ComponentMap = componentDef.reduce(
  (components, { c, t }): ComponentMap => {
    t.forEach((type): void => {
      components[type] = c;
    });

    return components;
  },
  ({} as unknown) as ComponentMap
);

export const fromDef = ({ displayName, info, sub, type }: TypeDef): string => {
  if (displayName && SPECIAL_TYPES.includes(displayName)) {
    return displayName;
  }

  switch (info) {
    case TypeDefInfo.Compact:
      return (sub as TypeDef).type;

    case TypeDefInfo.Option:
      return 'Option';

    case TypeDefInfo.Enum:
      return 'Enum';

    case TypeDefInfo.Struct:
      return 'Struct';

    case TypeDefInfo.Tuple:
      if (components[type] === Account) {
        return type;
      }

      return 'Tuple';

    case TypeDefInfo.Vec:
      if (type === 'Vec<u8>') {
        return 'Bytes';
      }

      return ['Vec<KeyValue>'].includes(type) ? 'Vec<KeyValue>' : 'Vec';

    case TypeDefInfo.VecFixed:
      if ((sub as TypeDef).type === 'u8') {
        return type;
      }

      return 'VecFixed';

    default:
      return type;
  }
};

export const getComponent = (def: TypeDef): ComponentType<ParamProps> => {
  const type = fromDef(def);
  const Component = components[type];

  return Component || Unknown;
};
