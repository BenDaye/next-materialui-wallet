import React, { memo, ReactElement, useEffect, useState } from 'react';
import type { Children } from '@components/types';
import { useApi, useIsMountedRef } from '@components/polkadot/hook';
import BN from 'bn.js';
import type {
  Codec,
  IExtrinsic,
  IMethod,
  TypeDef,
} from '@polkadot/types/types';

import { Enum, GenericCall, getTypeDef } from '@polkadot/types';
import type { ExtrinsicSignature } from '@polkadot/types/interfaces';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { formatBalance } from '@polkadot/util';
import { encodeTypeDef } from '@polkadot/types/create';

interface Param {
  name: string;
  type: TypeDef;
}

interface Value {
  isValid: boolean;
  value: Codec;
}

interface Extracted {
  hash: string | null;
  params: Param[];
  signature: string | null;
  signatureType: string | null;
  values: Value[];
}

interface ParamDef {
  length?: number;
  name?: string;
  type: TypeDef;
}

function isExtrinsic(value: IExtrinsic | IMethod): value is IExtrinsic {
  return !!(value as IExtrinsic).signature;
}

// This is no doubt NOT the way to do things - however there is no other option
function getRawSignature(value: IExtrinsic): ExtrinsicSignature | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (value as any)._raw?.signature?.multiSignature as ExtrinsicSignature;
}

function extractState(
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

interface TransactionParamsProps extends Children {
  labelHash?: React.ReactNode;
  labelSignature?: React.ReactNode;
  mortality?: string;
  extrinsic: IExtrinsic | IMethod;
  withHash?: boolean;
  withSignature?: boolean;
  tip?: BN;
}

function TransactionParams({
  children,
  labelHash,
  labelSignature,
  mortality,
  tip,
  extrinsic,
  withHash,
  withSignature,
}: TransactionParamsProps): ReactElement<TransactionParamsProps> {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [
    { hash, params, signature, signatureType, values },
    setExtracted,
  ] = useState<Extracted>({
    hash: null,
    params: [],
    signature: null,
    signatureType: null,
    values: [],
  });

  useEffect(() => {
    setExtracted(extractState(extrinsic));
  }, [extrinsic, withHash, withSignature, mountedRef]);

  return (
    <>
      <List disablePadding dense>
        {values &&
          params.map(({ name, type }: ParamDef, index: number) => (
            <ListItem
              key={`${name || ''}:${encodeTypeDef(type)}:${index}`}
              disableGutters
              divider
            >
              <ListItemText
                primary={`${name || ''}: ${encodeTypeDef(type)}`}
                primaryTypographyProps={{
                  variant: 'caption',
                  color: 'textSecondary',
                }}
                secondary={values[index].value.toString()}
                secondaryTypographyProps={{
                  variant: 'body2',
                  color: 'textPrimary',
                }}
              />
            </ListItem>
          ))}
        {signature && (
          <ListItem disableGutters divider>
            <ListItemText
              primary={`签名人 ${signatureType ? `(${signatureType})` : ''}`}
              secondary={signature}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </ListItem>
        )}
        {hash && (
          <ListItem disableGutters divider>
            <ListItemText
              primary="哈希"
              secondary={hash}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </ListItem>
        )}
        {mortality && (
          <ListItem disableGutters divider>
            <ListItemText
              primary="生命周期"
              secondary={mortality}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </ListItem>
        )}
        {tip?.gtn(0) && (
          <ListItem disableGutters divider>
            <ListItemText
              primary="tip"
              secondary={formatBalance(tip)}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </ListItem>
        )}
      </List>
      {children}
    </>
  );
}

export default memo(TransactionParams);
