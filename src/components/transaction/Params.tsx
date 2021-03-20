import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type { BaseProps } from '@@/types';
import { useApi, useNotice } from '@@/hook';
import { Box, List, ListItem, ListItemText } from '@material-ui/core';
import BN from 'bn.js';
import type { IExtrinsic, IMethod } from '@polkadot/types/types';
import { Extracted, ParamDef } from './types';
import { extractState } from './helper';
import { encodeTypeDef } from '@polkadot/types/create';
import { formatBalance } from '@polkadot/util';

interface TransactionParamsProps extends BaseProps {
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
  const { showError } = useNotice();
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
  }, [extrinsic, withHash, withSignature]);

  return (
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
      {children}
    </List>
  );
}

export const TransactionParamsProvider = memo(TransactionParams);
