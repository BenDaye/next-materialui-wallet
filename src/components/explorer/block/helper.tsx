import type { KeyedEvent } from '@components/polkadot/event/types';
import type { HeaderExtended } from '@polkadot/api-derive';
import type { EventRecord, SignedBlock } from '@polkadot/types/interfaces';
import type { DigestItem } from '@polkadot/types/interfaces/runtime/types';
import type { ReactNode } from 'react';
import { Raw, Struct, Tuple, Vec } from '@polkadot/types';
import type { Codec, TypeDef } from '@polkadot/types/types';
import { getTypeDef } from '@polkadot/types/create';
import { ParamDef } from '../event/types';
import { EventParam } from '../event/param';
import { Typography } from '@material-ui/core';

export const transformResult = ([events, block, header]: [
  EventRecord[],
  SignedBlock,
  HeaderExtended?
]): [KeyedEvent[], SignedBlock, HeaderExtended?] => [
  events.map((record, index) => ({
    indexes: [index],
    key: `${Date.now()}-${index}-${record.hash.toHex()}`,
    record,
    blockHash: block.hash.toHex(),
    blockNumber: header?.number.unwrap(),
  })),
  block,
  header,
];

const formatStruct = (struct: Struct): ReactNode => {
  const types: Record<string, string> = struct.Type;
  const params = Object.keys(types).map((name): {
    name: string;
    type: TypeDef;
  } => ({
    name,
    type: getTypeDef(types[name]),
  }));
  const values = struct.toArray().map((value): {
    isValid: boolean;
    value: Codec;
  } => ({
    isValid: true,
    value,
  }));

  return (
    <>
      {params.map(({ name, type }: ParamDef, index, array) => (
        <EventParam
          key={`log_param: ${index}`}
          name={name}
          type={type}
          value={values[index]}
        />
      ))}
    </>
  );
};

const formatTuple = (tuple: Tuple): ReactNode => {
  const types = tuple.Types;
  const params = types.map((type): { type: TypeDef } => ({
    type: getTypeDef(type),
  }));
  const values = tuple.toArray().map((value): {
    isValid: boolean;
    value: Codec;
  } => ({
    isValid: true,
    value,
  }));

  return (
    <>
      {params.map(({ name, type }: ParamDef, index, array) => (
        <EventParam
          key={`log_param: ${index}`}
          name={name}
          type={type}
          value={values[index]}
        />
      ))}
    </>
  );
};

const formatVector = (vector: Vec<Codec>): ReactNode => {
  const type = getTypeDef(vector.Type);
  const values = vector.toArray().map((value): {
    isValid: boolean;
    value: Codec;
  } => ({
    isValid: true,
    value,
  }));

  const params = values.map((_, index): { name: string; type: TypeDef } => ({
    name: `${index}`,
    type,
  }));

  return (
    <>
      {params.map(({ name, type }: ParamDef, index, array) => (
        <EventParam
          key={`log_param: ${index}`}
          name={name}
          type={type}
          value={values[index]}
        />
      ))}
    </>
  );
};

const formatU8a = (value: Raw): ReactNode => {
  const params = [{ type: getTypeDef('Bytes') }];
  const values = [{ isValid: true, value }];
  return (
    <>
      {params.map(({ name, type }: ParamDef, index, array) => (
        <EventParam
          key={`log_param: ${index}`}
          name={name}
          type={type}
          value={values[index]}
        />
      ))}
    </>
  );
};

export const formatLog = (log: DigestItem): ReactNode => {
  const { value } = log;
  if (value instanceof Struct) {
    return formatStruct(value);
  } else if (value instanceof Tuple) {
    return formatTuple(value);
  } else if (value instanceof Vec) {
    return formatVector(value);
  } else if (value instanceof Raw) {
    return formatU8a(value);
  } else {
    return (
      <Typography variant="body2" className="word-break">
        {value.toString()}
      </Typography>
    );
  }
};
