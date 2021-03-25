import { Enum, GenericCall, getTypeDef } from '@polkadot/types';
import type { IExtrinsic, IMethod } from '@polkadot/types/types';
import type { ExtrinsicSignature } from '@polkadot/types/interfaces';
import { Extracted, Param, Value } from './types';
import type { BlockNumber, Extrinsic } from '@polkadot/types/interfaces';

function isExtrinsic(value: IExtrinsic | IMethod): value is IExtrinsic {
  return !!(value as IExtrinsic).signature;
}

// This is no doubt NOT the way to do things - however there is no other option
function getRawSignature(value: IExtrinsic): ExtrinsicSignature | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (value as any)._raw?.signature?.multiSignature as ExtrinsicSignature;
}

export function extractState(
  value: IExtrinsic | IMethod,
  withHash?: boolean,
  withSignature?: boolean
): Extracted {
  const params = GenericCall.filterOrigin(value.meta).map(
    ({ name, type }): Param => ({
      name: name.toString(),
      type: getTypeDef(type.toString()),
    })
  );
  const values = value.args.map(
    (value): Value => ({
      isValid: true,
      value,
    })
  );
  const hash = withHash ? value.hash.toHex() : null;
  let signature: string | null = null;
  let signatureType: string | null = null;

  if (withSignature && isExtrinsic(value) && value.isSigned) {
    const raw = getRawSignature(value);

    signature = value.signature.toHex();
    signatureType = raw instanceof Enum ? raw.type : null;
  }

  return { hash, params, signature, signatureType, values };
}

export function getEra(
  { era }: Extrinsic,
  blockNumber?: BlockNumber
): [number, number] | null {
  if (blockNumber && era.isMortalEra) {
    const mortalEra = era.asMortalEra;

    return [
      mortalEra.birth(blockNumber.toNumber()),
      mortalEra.death(blockNumber.toNumber()),
    ];
  }

  return null;
}
